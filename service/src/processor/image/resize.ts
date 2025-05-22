import * as sharp from 'sharp';
import { IImageContext } from '.';
import { IActionOpts, InvalidArgument, ReadOnly } from '..';
import * as is from '../../is';
import { BaseImageAction } from './_base';

export const enum Mode {
    LFIT = 'lfit',
}

export interface ResizeOpts extends IActionOpts {
    w?: number;
}

export class ResizeAction extends BaseImageAction {
    public readonly name: string = 'resize';

    public validate(params: string[]): ReadOnly<ResizeOpts> {
        const opt: ResizeOpts = {};
        for (const param of params) {
            if ((this.name === param) || (!param)) {
                continue;
            }
            const [k, v] = param.split('_');
            if (k === 'w') {
                opt.w = Number.parseInt(v, 10);
            } else {
                throw new InvalidArgument(`Unknown param: "${k}"`);
            }
        }
        if (!opt.w) {
            throw new InvalidArgument('Width (w) is required for resize');
        }
        return opt;
    }

    public beforeProcess(ctx: IImageContext, params: string[], index: number): void {
        // 不做特殊处理
    }

    public async process(ctx: IImageContext, params: string[]): Promise<void> {
        const opt = this.validate(params);
        const metadata = ctx.metadata;
        if (!metadata.width || !metadata.height) {
            throw new InvalidArgument('Can\'t read image\'s width and height');
        }
        // 计算等比缩放后的高度
        const scale = opt.w / metadata.width;
        const newHeight = Math.round(metadata.height * scale);

        ctx.image.resize(opt.w, newHeight, {
            fit: sharp.fit.inside,
            withoutEnlargement: false,
        });
    }
}