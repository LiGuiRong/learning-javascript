;(function(global) {
    function pageTiming (time) {
        let timeObj = {
            // 页面加载耗时
            pageLoadTime: time.loadEventStart - time.navigationStart || 0,
            // DNS解析耗时
            pageDnsTime: time.domainLookupEnd - time.domainLookupStart || 0,
            // tcp耗时
            pageTcpTime: time.connectEnd - time.connectStart || 0,
            // 页面白屏时间
            pageWhiteTime: time.responseStart - time.navigationStart || 0,
            // 页面onload时间
            pageOnloadTime: time.loadEventEnd - time.navigationStart || 0,
            // 解析DOM树耗时
            pageParseDomTime: time.domComplete - time.domInteractive || 0,
            // DOM渲染完成时间
            pageCompleteRenderTime: time.domContentLoadedEventEnd - time.navigationStart || 0,
            // 页面准备时间
            pageReadyTime: time.fetchStart - time.navigationStart || 0,
            // 页面重定向时间
            pageRedirectTime: time.redirectEnd - time.redirectStart || 0,
            // request请求耗时
            pageRequestTime: time.responseEnd - time.requestStart || 0,
            // unload时间
            pageUnloadTime: time.unloadEventEnd - time.unloadEventStart || 0
        }
        console.log('页面重要性能指标：', timeObj);
        return timeObj;
    }
    // 页面各个资源信息
    function pageResource(resource) {
        let resArray = []
        resource.forEach(el => {
            let item = {
                name: el.name, // 文件地址
                type: el.initiatorType, // 文件类型
                reqTime: (el.responseEnd - el.requestStart) || 0 // 请求该资源HTTP总耗时
            }
            resArray.push(item);
        });
        console.log('页面资源加载重要指标', resArray);
        return(resArray);
    }
    // 页面加载方式
    function pageLoadMethod(type) {
        const typeObj = {
            '0': '页面通过点击链接，地址栏输入，表单提交，脚本操作等方式加载',
            '1': '页面通过重新加载按钮或者location.reload方法加载' ,
            '2': '页面通过前进和后退按钮加载',
            '255': '页面通过其他来源加载'
        }
        if (typeObj[type]) {
            console.log('页面载入方式：', typeObj[type]);
            return typeObj[type];
        } else {
            console.log('无法判断页面的加载方式，请检查入参是否为以下值：0，1，2，255');
            return '无法判断页面的加载方式，请检查入参是否为以下值：0，1，2，255';
        }
    }
    function uploadPagePerformance (config) {
        // 将页面性能信息上报
        console.log(config);
    }
    function _pageInit(config) {
        setTimeout(() => {
            let timing = performance.timing;
            let type = performance.navigation.type;
            let resource = performance.getEntries();
            pageTiming(timing);
            pageResource(resource);
            pageLoadMethod(type);
            uploadPagePerformance(config);
        }, 0)
    }
    // 对外暴露单一接口：pagePerformance
    global.pagePerformance = _pageInit;
})(window);
