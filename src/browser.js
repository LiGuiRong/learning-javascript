/**
 * 判断是否在微信环境下
 */
export function isWechat() {
    let ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('MicroMessenger') > -1;
}
