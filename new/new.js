/**
 * new 做了什么
 * 
 * 1、创建一个对象
 *
 * 2、将对象的__proto__属性指向构造函数的原型
 * 
 * 3、执行构造函数得到结果
 * 
 * 4、返回结果
 */

function myNew (ctx, ...args) {
  let obj = new Object()
  obj.__proto__ = ctx.prototype
  let result = ctx.apply(obj, ...args)
  return result instanceof Object ? result : obj
}
