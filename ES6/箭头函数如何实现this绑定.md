### 原理
this指向固定化并不是因为箭头函数内部有绑定this的机制，实际原因箭头函数根本就没有自己的this，导致内部this就是外层代码块的this，正是因为它没有this，所以不能作为构造函数使用

### 注意点
- 箭头函数没有this，arguments，super，new.target四个指向外层函数的变量
- 箭头函数不能使用call，apply，bind几个方法，因为其内部没有this
- 函数体内的this对象就是定义时所在的对象，而不是使用时所在的对象
- 不能使用yield命令，因此箭头函数不能用作Generator函数
- 如果有对象嵌套的情况，则this绑定到最近的一层对象上

### 例子
**this指向最初定义时所在的对象**，对**定义时所在的对象**要有清楚的理解
```js
var obj = {
    id: 1,
    test: () => {
        console.log(this);
    }
}
obj.test(); // window
// 这里输出是window的原因是箭头函数的this指向最初定义变量obj的this，及window.obj的window
```
改造后
```js
function Obj() {
    this.id = 1;
    this.test = () => {
        console.log(this);
    }
}
let obj = new Obj();
obj.test(); // Obj， 指向了定义时所在的对象Obj
```
