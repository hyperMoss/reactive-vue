let activeEffect;
import { extend } from '../shared/index';

class ReactiveEffect {
  // 反向收集
  deps = [];
  active = true;

  constructor(fn, scheduler) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    activeEffect = this;
    return this._fn();
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
}

export function effect(fn, options = {}) {
  // fn
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // options
  extend(_effect, options);

  _effect.run();

  // 以当前effect 实例作为this指向

  const runner = _effect.run.bind(_effect);

  runner.effect = _effect;
  return runner;
}

const targetMap = new Map();

export function track(target, key) {
  // set
  // targe -> key ->dep
  let depsMap = targetMap.get(target);

  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);

  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  if (!activeEffect) {
    return;
  }
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function stop(runner) {
  runner.effect.stop();
}
