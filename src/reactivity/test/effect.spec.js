import { describe, it , expect  } from "vitest";
import { reactive } from "../reactive";

describe('effect',()=>{
  it.skip('happy path',()=>{
    // 建立响应式对象
    const user = reactive({
      age:10
    })
    let nextAge

    // 依赖收集
    effect(()=>{
      nextAge = user.age+1
    })

    // get
    expect(nextAge).toBe(11)

    // update
    // set 操作依赖收集调用
    user.age++

    // get
    expect(nextAge).toBe(12)
  })
})