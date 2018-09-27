/**
 * 输出任意类型的参数的数据类型
 * @param { any } param 
 */
export function checkType(param) {
    return Object.prototype.toString.call(param).slice(8, -1);
}

/**
 * 判断一个对象是否为纯对象，即原型是{}或者使用Object.create(null)创建的对象
 * @param { Object } obj 
 */
export function isPlainObject(obj) {
    if (checkType(obj) !== 'Object') {
        throw new TypeError('the arguments must be an Object! please try again!');
    }
    return checkType(obj) === 'Object';
}

/**
 * 
 * @param {Array} arr 
 * 判断一个数组是否是空数组
 */
export function emptyArray(arr) {
    if (checkType(obj) !== 'Array') {
        throw new TypeError('the arguments must be an Array! please try again!');
    }
    return arr.length === 0;
}

/**
 * 
 * @param {Object} obj 
 * Object.keys返回对象可枚举的属性组成的数组
 * for...in还会获取原型链上的可枚举属性
 * Object.getOwnPropertyNames返回对象所有的属性组成的数组，不包括symbol值作为名称的属性
 */
export function emptyObject(obj) {
    if (checkType(obj) !== 'Object') {
        throw new TypeError('the arguments must be an Object! please try again!');
    }
    // let keys = Object.keys(obj);
    let keys = Object.getOwnPropertyNames(obj);
    return keys.length === 0;
}

/**
 * 
 * @param {Object} obj 
 * 获取对象不可枚举的属性
 */
export function unEnumProperties(obj) {
    if (checkType(obj) !== 'Object') {
        throw new TypeError('the arguments must be an Object! please try again!');
    }
    let allKeys = Object.getOwnPropertyNames(obj); // 对象自身所有属性，包括可枚举和不可枚举的属性
    let canEnumKeys = Object.keys(obj); // 对象自身可枚举属性
    let result = allKeys.filter((item) => {
        if (canEnumKeys.indexOf(item) > -1) {
            return false;
        } else {
            return true;
        }
    })
    return result || [];
}
