import { describe, expect,it } from "vitest";
import { reactive } from "../reactive";

describe("reactive",()=>{


  it('happy path',()=>{
    const original = {foo:1}
    const observed = reactive(original)
    
    // 原对象的foo值
    expect(observed.foo).toBe(1)
    // 与原对象不相等
    expect(observed).not.toBe(original)
  })
})