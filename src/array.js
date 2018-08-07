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
