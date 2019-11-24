# async/await使用小tips

async/await是一种异步解决方案，相对于其他异步解决方案，async/await语法在使用上是比较简单的，使用起来跟同步方法没有太大差异。

## 使用async/await

```js
function promiseFn () {
    return new Promise((resolve, reject) => {
        resolve(1);
    });
}

async function asyncFn() {
    const num = await promiseFn();
    console.log(num);  
}

asyncFn();  // 1
```

await 后面的内容，如果不是返回一个Promise，则会用Promise.resolve()进行一个隐式调用，确保返回的是一个Promise。

```js
function notPromiseFn () {
    return 1;
}

async function asyncFn () {
    const num = await notPromiseFn();
    console.log(num);
}
async function asyncFn2 () {
    const num = await 666;
    console.log(num);   
}

asyncFn(); // 1

asyncFn2(); // 666
```

**所以，其实我们可以不用管await后面返回的类型，都是可以使用async/await的。但如果不是异步函数的话，其实就没有必要这么用了，直接用同步的写法就好，毕竟async/await的目的就是用同步的模式来实现异步的操作的，同步代码也使用async/await就有点多此一举了。**

## 异常处理

异常处理是平时编写代码中必须要考虑的问题，因此，在async/await中也必须要对异常情况进行处理。

```js
function errorPromiseFn(type) {
    return new Promise((resolve, reject) => {
        if (type === 'error') {
            throw new Error('Error');
        }
        resolve(404);
    });
}

async function errorFn() {
    try {
        const res = await errorPromiseFn('error');
        console.log(res);
    } catch (err) {
        console.error(err);
    }
}

errorFn('error'); // 异常会被俘获
```

## 串行与并行

我们知道，同步代码都是串行执行的。但有的时候，我们并不希望都是串行执行的。比如，在需要请求多个没有相互依赖的接口数据时，最佳解决方案是并行执行。

```js
function getData1() {
    return new Promise((resolve, reject) => {
        fetch(url).then(res => resolve(res));
    });
}

function getData2(url) {
    return new Promise((resolve, reject) => {
        fetch(url).then(res => resolve(res));
    });
}

async serialGetAllData() {
    // 创建promise并等待处理结果
    const data1 = await getData1();
    // 等待前面的处理结果完成，再创建promise并处理结果
    const data2 = await getData2();
    return {data1, data2};
}

serialGetAllData();
```

上面的serialGetAllData就行串行的先去请求data1再去请求data2，但是data2其实并不需要等到data1请求完成后再去执行。因此，我们希望他们能够同步的进行。

### Promise.all实现异步并行

学过Promise的应该知道，Promise.all是支持多个Promise并行请求的。那么，在async/await中，我们就可以借助Promise.all来实现并行请求了。

```js
async parallelGetAllData() {
    const [data1, data2] = await Promise.all([
        getData1(),
        getData2()
    ]);
    return {data1, data2};
}

parallelGetAllData();
```

### 先创建Promise再使用await

除了Promise.all方法外，还有另外一种方法实现并行操作：先创建Promise再使用await。

```js
async parallelGetAllData() {
    // 创建多个promise实例
    const promise1 = getData1();
    const promise2 = getData2();
    // 同时等待多个promise的结果，
    // 假如promise1耗时三秒，promise2耗时两秒,
    // 由于promise1和promise2同时进行请求，
    // 因此只需3秒就可以得到data1和data2了
    const data1 = await promise1;
    const data2 = await promise2;
    return {data1, data2};
}
```

## 循环体中使用async/await

有时候，我们需要在循环体中去进行异步操作

```js
async function serialLoop() {
    let promises = [getData1, getData2];
    for (let promise of promises) {
       const data = await promise();
       console.log(data);
    }
}

serialLoop();
```

很显然，上面的代码是串行执行的，如果getData1需要3秒，getData2需要2秒，那么整个过程就需要5秒才能执行完成。

在上一节中，我们知道了async/await可以改造为并行执行

```js
async function parallelLoop() {
    let promises = [getData1(), getData2()];
    for (let promise of promises) {
        const data = await promise;
        console.log(data);
    }
}
parallelLoop();
```

这样，就只需要3秒就可以执行完了。
