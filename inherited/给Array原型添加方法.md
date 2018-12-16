### Array.prototype
给Array原型添加方法，在自定义方法中可以使用this来获取Array本身
```js
Array.prototype.multiply = function() {
    let res = [];
    for (let i = 0; i < this.length; i++) {
        res.push(this[i] * this[i]);
    }
    return res;
}
``` 