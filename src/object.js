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