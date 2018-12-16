/**
 * bind函数的polyfill实现
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function (bindObj) {
        // 使用bind函数的必须是函数
        if (typeof this !== 'function') {
            throw new Error('what is trying to be bind is not found');
        }

        let self = this;
        let fn = function () {};
        // let outerArgs = Array.prototype.slice.call(arguments, 1);
        let outerArgs = Array.from(arguments).slice(1, -1);

        let result = function() {
            // let innerArgs = Array.prototype.slice.call(arguments);
            let innerArgs = Array.from(arguments);
            let args = outerArgs.concat(innerArgs);

            // self instanceof fn === true时,说明返回的 fn 被当做new的构造函数调用
            return self.apply(self instanceof fn ? self : bindObj, args);
        }

        // 空对象的原型指向绑定函数的原型
        fn.prototype = self.prototype;
        // 空对象的实例赋值给result.prototype
        result.prototype = new fn();

        return result;
    }
}

if (!Function.prototype.call) {
    Function.prototype.call = function(ctx = window, ...args) {
        // 确保该属性的唯一性
        let fn = Symbol();
        ctx[fn] = this;
        // 指向绑定函数
        let result = ctx[fn](...args);
        // 避免污染
        delete ctx[fn];
        // 返回结果
        return result;
    }
}
