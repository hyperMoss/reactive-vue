import { describe, it, expect, vitest } from 'vitest';
import { reactive } from '../reactive';
import { effect, stop } from '../effects';

describe('effect', () => {
  it('happy effect', () => {
    // 建立响应式对象
    const user = reactive({
      age: 10,
    });
    let nextAge;

    // 依赖收集
    effect(() => {
      nextAge = user.age + 1;
    });

    // get
    expect(nextAge).toBe(11);

    // update
    // set 操作依赖收集调用
    user.age++;

    expect(nextAge).toBe(12);
  });

  it('应该返回一个runner', () => {
    // 1.effect(fn) -> function (runner) -> fn -> return
    // 返回一个runner

    let foo = 10;
    // 为effect定义变量
    const runner = effect(() => {
      foo++;
      return 'foo';
    });
    // 初始化执行一次cb
    expect(foo).toBe(11);
    // 接受返回值
    const r = runner();
    // 断言runner()执行会再次执行cb
    expect(foo).toBe(12);
    // 断言返回值
    expect(r).toBe('foo');
  });

  it('scheduler', () => {
    // 1. 通过effect 的 第二个参数,给定一个scheduler 的fn
    // 2. effect 第一次执行才会执行fn
    // 3. 当 响应式对象set update 不会执行fn ,执行scheduler
    // 4. 执行runner 时才会执行 fn
    let dummy;
    let run;
    // 抽离出runner
    const scheduler = vitest.fn(() => {
      run = runner;
    });

    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );

    // 一开始scheduler不会被调用
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // 调用第一个trigger
    obj.foo++;

    expect(scheduler).toHaveBeenCalledTimes(1);
    // schedule应该没被执行
    expect(dummy).toBe(1);

    // 手动执行
    run();
    // schedule应该被执行
    expect(dummy).toBe(2);
  });

  // it('stop', () => {
  //   let dummy;
  //   const obj = reactive({ prop: 1 });
  //   const runner = effect(() => {
  //     dummy = obj.prop;
  //   });
  //   obj.prop = 2;

  //   expect(dummy).toBe(2);
  //   // 停止自动runner 的执行

  //   stop(runner);
  //   obj.prop = 3;
  //   expect(dummy).toBe(2);

  //   // 手动执行
  //   runner(obj);
  //   expect(dummy).toBe(3);
  // });

  // it('onstop', () => {
  //   const obj = reactive({
  //     foo: 1,
  //   });

  //   const onStop = vitest.fn();

  //   let dummy;

  //   const runner = effect(
  //     () => {
  //       dummy = obj.foo;
  //     },
  //     { onStop }
  //   );

  //   stop(runner);
  //   expect(onStop).toBeCalledTimes(1);
  // });
});
