/**
 * 数组扁平化
 * let a = [1,2,3,[4,5,[6,7,8,[1,2,3]]]]
 * flatten(a) => [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3]
 * @param {Array} arr 
 */
export function flatten(arr) {
    if (!Array.isArray(arr)) {
        throw new TypeError('arguments is not a array, please try again');
    }
    let res = [];
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            res = res.concat(flatten(arr[i]));
        } else {
            res.push(arr[i]);
        }
    }
    return res;
}

/**
 * 从index开始，删除指定len长度的数组中的元素，
 * 返回被删除后的原数组
 * @param {Array} arr 
 * @param {Number} index 
 * @param {Number} len 
 */
export function deleteElement (arr, index, len) {
    let res = [];
    for (let i = 0; i < arr.length; i++) {
        if (i === index) {
            i = index + len -1;
            continue;
        }
        res.push(arr[i]);
    }
    return res;
}
