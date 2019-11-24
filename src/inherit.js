/**
 * 原型链继承
 * 父类的引用类型属性存在被共享的缺陷，同时子类无法像父类传参
 */

function Parent () {
    // something
}

Parent.prototype.myMethod = function () {
    // something
}

function Child () {
    // something
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;


/**
 * 构造函数继承（经典继承）
 * 解决了上述的共享属性和传参问题，但是无法复用父类的方法，同时每次都得执行父类的构造函数
 */

function Parent () {
    // something
}

function Child () {
    Parent.call(this);
    // something
}

/**
 * 组合继承
 * 解决了上述两种方法的缺点，但是存在的缺点是每次执行都要执行两次父类的构造方法
 */
function Parent () {
    // something
}

Parent.prototype.myMethod = function () {
    // something
}

function Child () {
    Parent.call(this);
    // something
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

/**
 * class继承
 */

class Parent {
    constructor() {
        // something
    }
}

class Child extends Parent {
    constructor() {
        super(this);
        // something
    }
}

/**
 * 原型式继承
 * 还是存在共享实例的缺点
 */
function createObject(o) {
    function fn(){};
    fn.prototype = o;
    return new fn();
}

/**
 * 寄生继承
 */
function createEnhancedObject(o) {
    const clone = Object.create(o);
    clone.myMethod = function () {
        // something
    }
    return clone;
}


/**
 * 寄生组合继承
 */
function inheritPrototype(Parent, Child) {
    Child.prototype = new Parent();
    Child.prototype.constructor = Child;
}

function Parent () {
    // something
}

Parent.prototype.myMethod = function () {
    // something
}

function Child () {
    Parent.call(this);
    // something
}

inheritPrototype(Parent, Child);
