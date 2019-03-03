### new 操作符
执行new操作符时，到底做了什么？
1、创建一个新对象实例，并将其__proto__属性指向构造函数的prototype属性
2、将构造函数调用的this指向这个函数，并执行构造函数
3、如果构造函数返回对象类型，则正常返回，否则返回这个对象

```js
function newOperator(func, ...args) {
    if (typeof func !== 'function') {
        throw new Error('第一个参数必须为函数');
    }
    // 1、创建一个新对象实例，并将其__proto__属性指向构造函数的prototype属性
    let newObj = Object.create(func.prototype);
    // 2、将构造函数调用的this指向这个函数，并执行构造函数
    let result = func.apply(newObj, args);
    // 3、如果构造函数返回对象类型，则正常返回，否则返回这个对象
    return result instanceof Object ? result : newObj;
}
```