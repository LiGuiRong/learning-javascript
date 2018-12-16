## 前言
在ES6中新增了let和const两种变量的声明方式，它们的使用方式与原先的var声明类似，最大的区别在于let和const具有块级作用域，并且不存在变量提升。本文主要记录对var,let,const的心得体会，以便后续查阅。

## var声明法
### 1.普通变量提升
使用var声明变量时，变量会被提升到当前作用域的最顶端，
```js
    function foo(flag) {
        console.log('baz1:', baz)
        if (flag) {
            var baz = 'hell0 world'
        }
        console.log('baz2:', baz)
    }
    foo(false)   // output: undefined,undefined
    foo(true)    // output: undefined,hell0 world
```

上面例子中的变量baz会提升到函数作用域顶部

```js
    function foo(flag) {
        var baz     // undefined
        console.log('baz1:', baz)
        if (flag) {
            baz = 'hell0 world'
        }
        console.log('baz2:', baz)
    }
    foo(false)   // output: undefined,undefined
    foo(true)    // output: undefined,hell0 world
```
在使用var声明变量的时候，最好把所有变量都声明在该作用域的最顶端

### 2.函数嵌套函数变量提升
函数嵌套函数的情况下，变量只会提升到距离其最近的一个函数顶部，遵循变量提升到当前作用域最顶端的规则
```js
    function foo() {
        function baz() {
            console.log(bar)   // undefined
            var bar = 'hello world'
        }
        baz()
        console.log(bar)   // Uncaught ReferenceError: bar is not defined
    }
    foo()
```
在上面的例子中，变量bar只会提升到离它最近的函数baz的顶部,而在foo函数作用域中，并没有声明该变量，直接调用该变量会报错
```js
    function foo() {
        function baz() {
            var bar
            console.log(bar)   // undefined
            bar = 'hello world'
        }
        baz()
        console.log(bar)   //Uncaught ReferenceError: bar is not defined
    }
    foo()
```

## let
### 1.块级作用域
let声明的变量只在它所在的代码块中有效
```js
    function foo(flag) {
        if (flag) {
            let baz = 'hello'
        }
        console.log(baz)
    }
    foo(false)   //Uncaught ReferenceError: baz is not defined
```

### 2.不存在变量提升
```js
    function foo() {
        console.log(baz)      //Uncaught ReferenceError: baz is not defined
        let baz = 'hello world'
    }

    function baz() {
        console.log(foo)      //undefined
        var foo = 'hello world'
    }
```
从上面的例子中可以看出来，let声明的变量不存在变量提升

### 3.不允许重复声明
使用var声明变量的时候，如果重复声明变量，并不会报错，后声明的变量会覆盖先声明的变量；而使用let声明变量的时候，不允许重复声明变量，会直接报错
```js
    var foo = 'hello'
    var foo = 'world'
    console.log(foo)  // output world

    let foo = 'hello'
    let foo = 'world'
    console.log(foo)  //Uncaught SyntaxError: Identifier 'b' has already been declared
```

## const
### 1.块级作用域
const与let相同，具有块级作用域

### 2.不允许重复声明
const也不允许重复声明

### 3.初始化必须赋值
同时，const声明的变量必须要初始化，否则会报错
```js
    const foo  // Uncaught SyntaxError: Missing initializer in const declaration
    const foo = 'baz'  // output 'baz'
    const foo = 'bar'  // Uncaught SyntaxError: Identifier 'foo' has already been declared
```
const是常量，不允许修改默认赋值，但如果const定义的是对象，那么可以修改对象内部的属性及属性值
```js
    //对象
    const obj = {
        a: 'hello',
        b: 'world' 
    }
    obj.a = 'hi'
    console.log(obj)  //{a: "hi", b: "world"}
    obj.c = 'welcome' 
    console.log(obj)  //{a: "hello", b: "world", c: "welcome"}

    obj = {    //Uncaught TypeError: Assignment to constant variable.
        a: 'hi'
    }

    const obj = {  //Uncaught SyntaxError: Identifier 'obj' has already been declared
        a: 'hi',
        b: 'world'
    }

    //数组
    const arr = []
    arr.push('hello')
    arr.push('world')
    console.log(arr)    // ["hello", "world"]

    arr[0] = 'hi'
    console.log(arr)    // ["hi", "world"]

    arr = ['welcome']   // Uncaught TypeError: Assignment to constant variable
```

> const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指针，const只能保证这个指针是固定的，至于它指向的数据结构是不是可变的，就完全不能控制了。因此，将一个对象声明为常量必须非常小心。[引自《ECMAScript6入门》---阮一峰]


## 临时死区（Temporal Dead Zone,TDZ）
### 1.定义
在当前作用域的块内，在声明变量前的区域叫临时死区

### 2.原因
let和const不存在变量提升
```js
    function foo() {
        console.log(baz)     // TDZ
        console.log(bar)     // TDZ
        let baz = 'hello'
        const bar = ' world'
    }
```

## 总结
在实际项目开发中，使用var、let还是const来声明变量，主要取决于变量值是否需要更新。通常如果希望变量值不被修改，可以选用const声明；而当变量值需要被修改时，可以使用var或let，但由于var没有块级作用域的约束，因此还是尽量少用var来声明变量。
