// import * as S3 from 'aws-sdk/clients/s3';
import * as SecretsManager from 'aws-sdk/clients/secretsmanager';
import * as SSM from 'aws-sdk/clients/ssm';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as koaCash from 'koa-cash';
import * as logger from 'koa-logger';
import * as Router from 'koa-router';
import { LRUCache } from 'lru-cache';
import * as sharp from 'sharp';
import config from './config';
import debug from './debug';
import { bufferStore, getBufferStores, getProcessor, parseRequest, setMaxGifSizeMB, setMaxGifPages } from './default';
import * as is from './is';
// import { Features, IHttpHeaders, InvalidArgument } from './processor';
import { Features, IHttpHeaders } from './processor';
import { IBufferStore } from './store';

// 定义一个接口来扩展Koa上下文
interface ExtendedContext extends Koa.ParameterizedContext {
  features?: { [key: string]: any };
}

// 定义缓存对象接口
interface CacheObject {
  body: any;
  type: string;
  headers: IHttpHeaders;
}

const MB = 1048576;

const ssm = new SSM({ region: config.region });
// const smclient = new SecretsManager({ region: config.region });

// Initialize buffer stores for all configured buckets
const bufferStores = getBufferStores();
const DefaultBufferStore = bufferStore();

const app = new Koa();
const router = new Router();
const lruCache = new LRUCache<string, CacheObject>({
  max: config.CACHE_MAX_ITEMS,
  maxSize: config.CACHE_MAX_SIZE_MB * MB,
  ttl: config.CACHE_TTL_SEC * 1000,
  sizeCalculation: (value: CacheObject) => {
    return value.body.length;
  },
});

sharp.cache({ items: 500, files: 200, memory: 1024 });

app.use(logger());
app.use(errorHandler());
app.use(bodyParser());
app.use(koaCash({
  setCachedHeader: true,
  hash(ctx) {
    return ctx.headers['x-bucket'] + ctx.request.url;
  },
  get: (key) => {
    return Promise.resolve(lruCache.get(key));
  },
  set: (key, value) => {
    lruCache.set(key, value as CacheObject);
    return Promise.resolve();
  },
}));

// 禁止任何上传行为，直接返回 403
router.post('/images', async (ctx) => {
  ctx.status = 403;
  ctx.body = { message: '上传被禁止' };
});

router.get(['/', '/ping'], async (ctx) => {
  ctx.body = 'ok';

  try {
    await setMaxGifLimit();
  } catch (err: any) {
    console.error(err);
  }
});

router.get(['/debug', '/_debug'], async (ctx) => {
  console.log(JSON.stringify(debug(lruCache)));
  ctx.status = 400;
  ctx.body = 'Please check your server logs for more details!';
});

router.get('/(.*)', async (ctx: ExtendedContext) => {
  if (await ctx.cashed()) return;

  const queue = sharp.counters().queue;
  if (queue > config.sharpQueueLimit) {
    ctx.body = { message: 'Too many requests, please try again later.' };
    ctx.status = 429;
    return;
  }
  
  // 检查Accept头是否包含image/avif
  const acceptHeader = ctx.get('Accept') || '';
  const acceptsAvif = acceptHeader.includes('image/avif');
  
  // 如果客户端支持AVIF并且配置启用了自动AVIF
  if (acceptsAvif && config.autoAvif) {
    ctx.features = ctx.features || {};
    ctx.features[Features.AutoAvif] = true;
  }
  
  const { data, type, headers } = await ossprocess(ctx);
  ctx.body = data;
  ctx.type = type;
  ctx.set(headers);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', (err: Error) => {
  const msg = err.stack || err.toString();
  console.error(`\n${msg.replace(/^/gm, '  ')}\n`);
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log('Config:', JSON.stringify(config));
});

function errorHandler(): Koa.Middleware<Koa.DefaultState, Koa.DefaultContext, any> {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err: any) {
      // ENOENT support
      if (err.code === 'ENOENT') {
        err.status = 404;
        err.message = 'NotFound';
      }
      ctx.status = err.statusCode || err.status || 500;
      ctx.body = {
        status: err.status,
        name: err.name,
        message: err.message,
      };

      ctx.app.emit('error', err, ctx);
    }
  };
}

function getBufferStore(ctx: ExtendedContext): IBufferStore {
  const bucket = ctx.headers['x-bucket'];
  if (bucket && typeof bucket === 'string') {
    // Check if we have a store for this bucket
    const store = bufferStores.get(bucket);
    if (store) {
      return store;
    }
    
    // If the bucket is not in our pre-configured list but is specified in the request,
    // create a new store for it (this allows dynamic bucket access)
    const newStore = bufferStore(bucket);
    bufferStores.set(bucket, newStore);
    return newStore;
  }
  return DefaultBufferStore;
}

async function ossprocess(ctx: ExtendedContext):
Promise<{ data: any; type: string; headers: IHttpHeaders }> {
  const { uri, actions } = parseRequest(ctx.path, ctx.query);
  
  // 只通过 x-bucket 头选择存储桶，不再解析路径
  const bs = getBufferStore(ctx);
  
  // 检查是否有处理操作
  if (actions.length > 1) {
    console.log(`Processing image with ${actions.length - 1} actions`);
    const processor = getProcessor(actions[0]);
    const context = await processor.newContext(uri, actions, bs);
    
    // 如果客户端支持AVIF并且配置启用了自动AVIF
    if (ctx.features && ctx.features[Features.AutoAvif]) {
      context.features[Features.AutoAvif] = true;
    }
    
    const { data, type } = await processor.process(context);
    return { data, type, headers: context.headers };
  } else {
    console.log(`Direct access to image: ${uri}`);
    // 直接访问图像，不再需要bypass函数
    const { buffer, type, headers } = await bs.get(uri);
    return { data: buffer, type: type, headers: headers };
  }
}

// async function validatePostRequest(ctx: Koa.ParameterizedContext) {
  // Fox edited in 2022/04/25: enhance the security of the post requests
  // const authHeader = ctx.get('X-Client-Authorization');
  // const secretHeader = await getHeaderFromSecretsManager();

  // if (authHeader !== secretHeader) {
  //  throw new InvalidArgument('Invalid post header.');
  // }

  // const body = ctx.request.body;
  // if (!body) {
  //  throw new InvalidArgument('Empty post body.');
  // }
  // const valid = body.params
  //   && body.sourceBucket
  //   && body.sourceObject
  //   && body.targetBucket
  //   && body.targetObject;
  // if (!valid) {
  //   throw new InvalidArgument('Invalid post body.');
  // }
  // return {
  //   params: body.params,
  //   sourceBucket: body.sourceBucket,
  //   sourceObject: body.sourceObject,
  //   targetBucket: body.targetBucket,
  //   targetObject: body.targetObject,
  // };
// }

// async function getSecretFromSecretsManager() {
//   // Load the AWS SDK
//   const secretName = config.secretName;
//   return smclient.getSecretValue({ SecretId: secretName }).promise();
// }

// async function getHeaderFromSecretsManager() {
//   const secret = await getSecretFromSecretsManager();
//   const secretString = secret.SecretString!;
//   const keypair = JSON.parse(secretString);
//   return keypair['X-Client-Authorization'];
// }

async function setMaxGifLimit() {
  if (config.configJsonParameterName) {
    const data = await ssm.getParameter({ Name: config.configJsonParameterName }).promise();
    if (data.Parameter) {
      const configJson = JSON.parse(data.Parameter.Value ?? '{}');
      const maxGifSizeMB = configJson.max_gif_size_mb;
      if (is.number(maxGifSizeMB)) {
        setMaxGifSizeMB(maxGifSizeMB);
      }
      const maxGifPages = configJson.max_gif_pages;
      if (is.number(maxGifPages)) {
        setMaxGifPages(maxGifPages);
      }
    }
  }
}
