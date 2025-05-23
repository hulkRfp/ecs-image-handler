"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sharp = require("sharp");
const contrast_1 = require("../../../src/processor/image/contrast");
const utils_1 = require("./utils");
test('quality action validate', () => {
    const action = new contrast_1.ContrastAction();
    const param1 = action.validate('contrast,-50'.split(','));
    expect(param1).toEqual({
        contrast: -50,
    });
    expect(() => {
        action.validate('contrast'.split(','));
    }).toThrowError(/Contrast param error, e.g: contrast,-50/);
    expect(() => {
        action.validate('contrast,xx,22'.split(','));
    }).toThrowError(/Contrast param error, e.g: contrast,-50/);
    expect(() => {
        action.validate('contrast,abc'.split(','));
    }).toThrowError(/Contrast must be between -100 and 100/);
    expect(() => {
        action.validate('contrast,101'.split(','));
    }).toThrowError(/Contrast must be between -100 and 100/);
    expect(() => {
        action.validate('contrast,-101'.split(','));
    }).toThrowError(/Contrast must be between -100 and 100/);
});
test('quality action', async () => {
    const ctx = await (0, utils_1.mkctx)('example.jpg');
    const action = new contrast_1.ContrastAction();
    await action.process(ctx, 'contrast,-50'.split(','));
    const { info } = await ctx.image.toBuffer({ resolveWithObject: true });
    expect(info.format).toBe(sharp.format.jpeg.id);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhc3QudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvcHJvY2Vzc29yL2ltYWdlL2NvbnRyYXN0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBK0I7QUFDL0Isb0VBQXVFO0FBQ3ZFLG1DQUFnQztBQUVoQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLE1BQU0sTUFBTSxHQUFHLElBQUkseUJBQWMsRUFBRSxDQUFDO0lBQ3BDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzFELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDckIsUUFBUSxFQUFFLENBQUMsRUFBRTtLQUNkLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFDVixNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMseUNBQXlDLENBQUMsQ0FBQztJQUUzRCxNQUFNLENBQUMsR0FBRyxFQUFFO1FBQ1YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMseUNBQXlDLENBQUMsQ0FBQztJQUUzRCxNQUFNLENBQUMsR0FBRyxFQUFFO1FBQ1YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7SUFHekQsTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUNWLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0lBRXpELE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFDVixNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsdUNBQXVDLENBQUMsQ0FBQztBQUczRCxDQUFDLENBQUMsQ0FBQztBQUdILElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLElBQUksRUFBRTtJQUNoQyxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUEsYUFBSyxFQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sTUFBTSxHQUFHLElBQUkseUJBQWMsRUFBRSxDQUFDO0lBQ3BDLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3JELE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUV2RSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqRCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNoYXJwIGZyb20gJ3NoYXJwJztcbmltcG9ydCB7IENvbnRyYXN0QWN0aW9uIH0gZnJvbSAnLi4vLi4vLi4vc3JjL3Byb2Nlc3Nvci9pbWFnZS9jb250cmFzdCc7XG5pbXBvcnQgeyBta2N0eCB9IGZyb20gJy4vdXRpbHMnO1xuXG50ZXN0KCdxdWFsaXR5IGFjdGlvbiB2YWxpZGF0ZScsICgpID0+IHtcbiAgY29uc3QgYWN0aW9uID0gbmV3IENvbnRyYXN0QWN0aW9uKCk7XG4gIGNvbnN0IHBhcmFtMSA9IGFjdGlvbi52YWxpZGF0ZSgnY29udHJhc3QsLTUwJy5zcGxpdCgnLCcpKTtcbiAgZXhwZWN0KHBhcmFtMSkudG9FcXVhbCh7XG4gICAgY29udHJhc3Q6IC01MCxcbiAgfSk7XG5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICBhY3Rpb24udmFsaWRhdGUoJ2NvbnRyYXN0Jy5zcGxpdCgnLCcpKTtcbiAgfSkudG9UaHJvd0Vycm9yKC9Db250cmFzdCBwYXJhbSBlcnJvciwgZS5nOiBjb250cmFzdCwtNTAvKTtcblxuICBleHBlY3QoKCkgPT4ge1xuICAgIGFjdGlvbi52YWxpZGF0ZSgnY29udHJhc3QseHgsMjInLnNwbGl0KCcsJykpO1xuICB9KS50b1Rocm93RXJyb3IoL0NvbnRyYXN0IHBhcmFtIGVycm9yLCBlLmc6IGNvbnRyYXN0LC01MC8pO1xuXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgYWN0aW9uLnZhbGlkYXRlKCdjb250cmFzdCxhYmMnLnNwbGl0KCcsJykpO1xuICB9KS50b1Rocm93RXJyb3IoL0NvbnRyYXN0IG11c3QgYmUgYmV0d2VlbiAtMTAwIGFuZCAxMDAvKTtcblxuXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgYWN0aW9uLnZhbGlkYXRlKCdjb250cmFzdCwxMDEnLnNwbGl0KCcsJykpO1xuICB9KS50b1Rocm93RXJyb3IoL0NvbnRyYXN0IG11c3QgYmUgYmV0d2VlbiAtMTAwIGFuZCAxMDAvKTtcblxuICBleHBlY3QoKCkgPT4ge1xuICAgIGFjdGlvbi52YWxpZGF0ZSgnY29udHJhc3QsLTEwMScuc3BsaXQoJywnKSk7XG4gIH0pLnRvVGhyb3dFcnJvcigvQ29udHJhc3QgbXVzdCBiZSBiZXR3ZWVuIC0xMDAgYW5kIDEwMC8pO1xuXG5cbn0pO1xuXG5cbnRlc3QoJ3F1YWxpdHkgYWN0aW9uJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBjdHggPSBhd2FpdCBta2N0eCgnZXhhbXBsZS5qcGcnKTtcbiAgY29uc3QgYWN0aW9uID0gbmV3IENvbnRyYXN0QWN0aW9uKCk7XG4gIGF3YWl0IGFjdGlvbi5wcm9jZXNzKGN0eCwgJ2NvbnRyYXN0LC01MCcuc3BsaXQoJywnKSk7XG4gIGNvbnN0IHsgaW5mbyB9ID0gYXdhaXQgY3R4LmltYWdlLnRvQnVmZmVyKHsgcmVzb2x2ZVdpdGhPYmplY3Q6IHRydWUgfSk7XG5cbiAgZXhwZWN0KGluZm8uZm9ybWF0KS50b0JlKHNoYXJwLmZvcm1hdC5qcGVnLmlkKTtcbn0pOyJdfQ==