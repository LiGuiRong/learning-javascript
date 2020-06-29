
/**
 * apply、call方法能够改变调用函数的this指向。具体实现方法是将该调用函数挂载到
 * 需要指向的目标对象上，成为目标对象的一个方法，然后执行该目标对象的方法，就能
 * 实现调用函数this指向的改变了。需要注意的是挂载时要避免污染对象的原有方法或者
 * 是被其他操作污染，所以可以使用symbol来作为key值。
 */

Function.prototype.myCall = function(ctx = window, ...args) {
  let symbol = Symbol()
  ctx[symbol] = this
  let result = ctx[symbol](...args)
  delete ctx[symbol]
  return result
}

Function.prototype.myApply = function(ctx = window, args = []) {
  let symbol = Symbol()
  ctx[symbol] = this
  let result = ctx[symbol](args)
  delete ctx[symbol]
  return result
}

Function.prototype.myBind = function(ctx, ...args) {
  const fn = this
  return function newFn(...newArgs) {
    if (this instanceof newFn) {
      return new newFn(...args, ...newArgs)
    } else {
      return fn.apply(ctx, [...args, ...newArgs])
    }
  }
}
