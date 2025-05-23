"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkctx = exports.fixtureStore = void 0;
const path = require("path");
const sharp = require("sharp");
const _base_1 = require("../../../src/processor/image/_base");
const store_1 = require("../../../src/store");
exports.fixtureStore = new store_1.LocalStore(path.join(__dirname, '../../fixtures'));
async function mkctx(name, actions, bufferStore) {
    if (!bufferStore) {
        bufferStore = exports.fixtureStore;
    }
    const image = sharp((await bufferStore.get(name)).buffer, {
        animated: (name.endsWith('.gif') || name.endsWith('.webp')),
    });
    const actions2 = actions !== null && actions !== void 0 ? actions : [];
    const mask = new _base_1.ActionMask(actions2);
    return { uri: name, actions: actions2, mask, image, bufferStore, features: {}, headers: {}, metadata: await image.metadata() };
}
exports.mkctx = mkctx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L3Byb2Nlc3Nvci9pbWFnZS91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0IsK0JBQStCO0FBRS9CLDhEQUFnRTtBQUNoRSw4Q0FBOEQ7QUFFakQsUUFBQSxZQUFZLEdBQUcsSUFBSSxrQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztBQUU1RSxLQUFLLFVBQVUsS0FBSyxDQUFDLElBQVksRUFBRSxPQUFrQixFQUFFLFdBQTBCO0lBQ3RGLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDaEIsV0FBVyxHQUFHLG9CQUFZLENBQUM7S0FDNUI7SUFDRCxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxNQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7UUFDeEQsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzVELENBQUMsQ0FBQztJQUVILE1BQU0sUUFBUSxHQUFHLE9BQU8sYUFBUCxPQUFPLGNBQVAsT0FBTyxHQUFJLEVBQUUsQ0FBQztJQUMvQixNQUFNLElBQUksR0FBRyxJQUFJLGtCQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7QUFDakksQ0FBQztBQVhELHNCQVdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHNoYXJwIGZyb20gJ3NoYXJwJztcbmltcG9ydCB7IElJbWFnZUNvbnRleHQgfSBmcm9tICcuLi8uLi8uLi9zcmMvcHJvY2Vzc29yL2ltYWdlJztcbmltcG9ydCB7IEFjdGlvbk1hc2sgfSBmcm9tICcuLi8uLi8uLi9zcmMvcHJvY2Vzc29yL2ltYWdlL19iYXNlJztcbmltcG9ydCB7IElCdWZmZXJTdG9yZSwgTG9jYWxTdG9yZSB9IGZyb20gJy4uLy4uLy4uL3NyYy9zdG9yZSc7XG5cbmV4cG9ydCBjb25zdCBmaXh0dXJlU3RvcmUgPSBuZXcgTG9jYWxTdG9yZShwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vZml4dHVyZXMnKSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBta2N0eChuYW1lOiBzdHJpbmcsIGFjdGlvbnM/OiBzdHJpbmdbXSwgYnVmZmVyU3RvcmU/OiBJQnVmZmVyU3RvcmUpOiBQcm9taXNlPElJbWFnZUNvbnRleHQ+IHtcbiAgaWYgKCFidWZmZXJTdG9yZSkge1xuICAgIGJ1ZmZlclN0b3JlID0gZml4dHVyZVN0b3JlO1xuICB9XG4gIGNvbnN0IGltYWdlID0gc2hhcnAoKGF3YWl0IGJ1ZmZlclN0b3JlLmdldChuYW1lKSkuYnVmZmVyLCB7XG4gICAgYW5pbWF0ZWQ6IChuYW1lLmVuZHNXaXRoKCcuZ2lmJykgfHwgbmFtZS5lbmRzV2l0aCgnLndlYnAnKSksXG4gIH0pO1xuXG4gIGNvbnN0IGFjdGlvbnMyID0gYWN0aW9ucyA/PyBbXTtcbiAgY29uc3QgbWFzayA9IG5ldyBBY3Rpb25NYXNrKGFjdGlvbnMyKTtcbiAgcmV0dXJuIHsgdXJpOiBuYW1lLCBhY3Rpb25zOiBhY3Rpb25zMiwgbWFzaywgaW1hZ2UsIGJ1ZmZlclN0b3JlLCBmZWF0dXJlczoge30sIGhlYWRlcnM6IHt9LCBtZXRhZGF0YTogYXdhaXQgaW1hZ2UubWV0YWRhdGEoKSB9O1xufSJdfQ==