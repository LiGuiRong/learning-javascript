### babel转换器
用于将ES6转换成ES5的工具

### class转换
```js
// es6
class Person {
    constructor (name, age) {
        this.name = name;
        this.age = age;
    }

    getName () {
        return this.name;
    }
}

// bable 转译后结果
"use strict";
var _createClass = (function() {
    // 设置对象属性值
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) {
                // 如果有value值则取value，并将writable设置为true，否则直接用set，get函数
                descriptor.writable = true;
            }
            Object,defineProperty(target, descriptor.key, descriptor);
        }
    }
    // 普通方法添加到构造函数的原型链上
    // 静态属性添加到构造函数上
    retrun function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, protoProps);
        return Constructor;
    }
})();

// 检测是否通过new来调用
function _calssCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("cannot call a class as a function");
    }
}

var person = (function() {
    function Person(name, age) {
        _calssCallCheck(this, Person);
        this.name = name;
        this.age = age;
    }

    // 添加属性到对象上
    _createClass(Person, [
        {
            key: "getName",
            value: function getName() {
                return this.name;
            }
        }
    ]);

    return Person;
})();

```

### class extends转换

```js
// es6继承
class Parent {
    constructor (name, age) {
        this.name = name;
        this.age = age;
    }
}

class Child extends Parent{
    constructor (name, age, sex){
        super(name, age);
        this.sex = sex;
    }

    greeting (str) {
        console.log (str);
    }
}

// Babel转换
function _posssibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called";
        );
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== "null") {
        throw new TypeError(
            "Super expression must either be null or a function, not " + typeof superClass 
        );
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) {
        Object.setPrototypeOf 
            ? Object.setPrototypeOf(subClass, superClass) 
            : (subClass.__proto__ = superClass);
    }
}

var Parent = function Parent(name, age) {
    _classCallCheck(this, Parent);
    this.name = name;
    this.age = age;
};

var Child = (function(_Parent) {
    _inherits(Child, _Parent);

    function Child(name, age, sex) {
        _classCallCheck(this, Child);
        var _this = _possibleConstructorReturn(
            this,
            (Child.__proto__ || Object.getPrototypeOf(Child)).call(this, name, age);
        );
        _this.sex = sex;
        return _this;
    }

    _createClass(Child, [
        {
            key: "greeting",
            value: function greeting(str) {
                console.log(str);
            }
        }
    ]);

    return Child;
})(Parent);
```