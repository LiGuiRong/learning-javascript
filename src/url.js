export function getQueryString(obj) {
    let arr = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
    }
    return arr.join('&');
}
