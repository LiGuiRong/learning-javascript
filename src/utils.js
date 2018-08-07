/**
 * 输出任意类型的参数的数据类型
 * @param { any } param 
 */
export function checkType(param) {
    return Object.prototype.toString.call(param).slice(8, -1);
}

/**
 * 判断一个对象是否为纯对象，及原型是{}或者使用Object.create(null)创建的对象
 * @param { Object } obj 
 */
export function isPlainObject(obj) {
    return checkType(obj) === 'Object';
}
