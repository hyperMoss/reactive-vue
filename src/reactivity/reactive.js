import { track } from "./effects";
import { trigger } from "./effects";

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      // {foo:1} foo

      const res = Reflect.get(target, key);
      // 依赖收集
      track(target,key)
      return res;
    },

    set(target,key,value){
      const res = Reflect.set(target, key, value);

      // 触发依赖收集
      trigger(target,key)
      return res
    }
  });
}
