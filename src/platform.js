/**
 * 判断是否在微信环境下
 */
export function isWechat() {
    let ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('MicroMessenger') > -1;
}

/**
 * 检查浏览器所在的操作系统环境
 */
export function detectedPlatfotm() {
    let isWin = navigator.platform === 'Win32' || navigator.platform === 'Windows';
    let isMac = navigator.platform === 'Mac68K' || navigator.platform === 'MacPPC' || navigator.platform === 'Macintosh' || navigator.platform === 'MacIntel';
    let isUnix = navigator.platform === 'X11' && !isWin && !isMac;
    let isLinux = navigator.platform.indexOf('Linux') > -1;
    
    let ua = navigator.userAgent;
    let isWin2000 = ua.indexOf('Windows NT 5.0') > -1 || ua.indexOf('Windows 2000') > -1;
    let isWinXP = ua.indexOf('Windows NT 5.1') > -1 || ua.indexOf('Windows XP') > -1;
    let isWin2003 = ua.indexOf('Windows NT 5.2') > -1 || ua.indexOf('Windows 2003') > -1;
    let isWinVista = ua.indexOf('Windows NT 6.0') > -1 || ua.indexOf('Windows Vista') > -1;
    let isWin7 = ua.indexOf('Windows NT 6.1') > -1 || ua.indexOf('Windows 7') > -1;
    let isWin10 = ua.indexOf('Windows NT 10') > -1 || ua.indexOf('Windows 10') > -1;

    if (isMac) return 'Mac';
    if (isUnix) return 'Unix';
    if (isLinux) return 'Linux';
    if (isWin) {
        if (isWin2000) return 'Windows 2000';
        if (isWinXP) return 'Windows XP';
        if (isWin2003) return 'Windows 2003';
        if (isWinVista) return 'Windows Vista';
        if (isWin7) return 'Windows 7';
        if (isWin10) return 'Windows 10';
    }
}