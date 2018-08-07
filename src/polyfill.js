/**
 * bind函数的polyfill实现
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function (bindObj) {
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

        fn.prototype = self.prototype;
        result.prototype = new fn();

        return result;
    }
}