console.log('script start')

setTimeout(() => {
  console.log('setTimeout 1')
}, 1000);

new Promise((resolve, reject) => {
  resolve()
  // reject()
  console.log('new Promise');
}).then(() => {
  console.log('resolve');
}, () => {
  console.log('reject');
})

setTimeout(() => {
  console.log('setTimeout 2')
}, 1000);

console.log('script end')

// script start
// new Promise
// script end
// resolve
// setTimeout 1
// setTimeout 2


console.log('script start')

setTimeout(() => {
  console.log('setTimeout 1')
}, 1000);

new Promise((resolve, reject) => {
  reject()
  console.log('new Promise');
}).then(() => {
  console.log('resolve');
}, () => {
  console.log('reject');
})

setTimeout(() => {
  console.log('setTimeout 2')
}, 1000);

console.log('script end')

// script start
// new Promise
// script end
// reject
// setTimeout 1
// setTimeout 2



console.log('script start')

setTimeout(() => {
  console.log('setTimeout 1')
}, 1000);

new Promise((resolve, reject) => {
  console.log('new Promise');
}).then(() => {
  console.log('resolve');
}, () => {
  console.log('reject');
})

setTimeout(() => {
  console.log('setTimeout 2')
}, 1000);

console.log('script end')

// script start
// new Promise
// script end
// setTimeout 1
// setTimeout 2


console.log('script start')

setTimeout(() => {
  console.log('setTimeout 1')
}, 1000);

new Promise((resolve, reject) => {
  resolve()
  console.log('new Promise');
}).then(() => {
  console.log('resolve');
}, () => {
  console.log('reject');
})

// await 后面的函数会立即同步执行，下面的语句会添加到微任务队列中
async function asyncFn() {
  console.log('asyncFn start'); // 执行
  await asyncFn1(); // 执行
  console.log('asyncFn end'); // 加入微任务队列
}

async function asyncFn1() {
  console.log('asyncFn1 start');
}

asyncFn();

setTimeout(() => {
  console.log('setTimeout 2')
}, 1000);

console.log('script end')

// script start
// new Promise
// asyncFn start
// asyncFn1 start
// script end
// resolve
// asyncFn end
// setTimeout 1
// setTimeout 2
