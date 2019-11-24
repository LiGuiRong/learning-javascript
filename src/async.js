function promiseFn() {
    return new Promise((resolve, reject) => {
        resolve(1);
    });
}

function promiseFn2() {
    return new Promise((resolve, reject) => {
        resolve(2);
    });
}

function promiseFn3() {
    return new Promise((resolve, reject) => {
        resolve(3);
    });
}

function notPromiseFn() {
    return 1;
}

async function logPromise() {
    const a =  await promiseFn();
    console.log(a);
}

async function logNotPromise() {
    await notPromiseFn();
    const num = await 666;
    console.log(num);
}

// logPromise();

// await 后面的内容，如果不是Promise，则会用Promise.resolve()进行一个隐式调用，确保返回的是一个Promise
// logNotPromise();


// 串行
async function serialFn() {
    console.time('serialFn');
    const num2 = await promiseFn2();
    const num3 = await promiseFn3();
    console.log(num2, num3);
    console.timeEnd('serialFn');
}

// 借助Promise.all来实现并行
async function parallelFn() {
    console.time('parallelFn');
    const [num2, num3] = await Promise.all([
        promiseFn2(),
        promiseFn3()
    ]);
    console.log(num2, num3);
    console.timeEnd('parallelFn');
}

async function parallelFn2() {
    console.time('parallelFn2');

    const fn2 = promiseFn2();
    const fn3 = promiseFn3();

    const num2 = await fn2;
    const num3 = await fn3;

    console.log(num2, num3);

    console.timeEnd('parallelFn2');
}


// 循环中用promise
async function loopFn() {
    console.time('loopFn');
    let promises = [promiseFn2(), promiseFn3()];
    for (let promise of promises) {
        console.log(await promise);
    }
    console.timeEnd('loopFn');
}

// 循环中用promise
async function loopFn2() {
    console.time('loopFn2');
    let promises = [promiseFn2, promiseFn3];
    for (let promise of promises) {
       const num = await promise();
       console.log(num);
    }
    console.timeEnd('loopFn2');
}


// 异常处理
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

function notPromiseFn() {
    return 1;
}

async function asyncFn() {
    const num = await notPromiseFn();
    console.log(num);
}

asyncFn();

// serialFn();

// parallelFn();

// parallelFn2();

loopFn();

loopFn2();

// errorFn();