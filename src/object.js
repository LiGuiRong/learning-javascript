import { checkType } from './utils';

/**
 * 对象深复制
 * @param {object} obj 
 */
export function deepCopy(obj) {
    let res = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                res[key] = deepCopy(obj[key]);
            } else {
                res[key] = obj[key];
            }
        }
    }
    return res;
}

/**
 * 对象继承
 * @param {Function | Object} obj 
 */
export function inherit(obj) {
    if (obj === null) {
        throw TypeError();
    }
    if (Object.create) {
        return Object.create(obj);
    }
    let type = typeof obj;
    if (type !== 'function' && type !== 'object') {
        throw TypeError();
    }
    function f() {};    // 定义一个空构造函数
    f.prototype = obj;  // 将其原型设置为obj
    return new f();     // 使用f()创建obj的继承对象
}

/**
 * 对象扁平化
 * @param {Object} obj 
 */
export function flatten (obj) {
    let result = {};
    function excute(src, prop) {
        let type = typeof src;
        if (type === 'object') {
            let isEmpty = true;
            for (let p in src) {
                isEmpty = false;
                excute(src[p], prop ? prop + '.' + p : p)
            }
            if (isEmpty && prop) {
                result[prop] = {};
            }
        } else if(type === 'Array') {
            if (src.length > 0) {
                src.forEach((item, index) => {
                    excute(item, prop ? prop + '.[' + index + ']' : index);
                })
            } else {
                result[prop] = [];
            }
        } else {
            result[prop] = src;
        }
    }
    excute(obj, '');
    return result;
} 

/**
 * 对象浅复制
 * @param {object} obj 
 */
export function shadowCopy(obj) {
    let res = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            res[key] = obj[key];
        }
    }
    return res;
}