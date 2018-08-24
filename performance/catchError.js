;(function(global) {
    let errorList = [];
    let errorInfo = {
        time: '',
        name: 'js',
        msg: '',
        data: {}
    };
    function _initError(config) {
        // img, script, css, jsonp
        window.addEventListener('error', function(e) {
            let obj = Object.assign({}, errorInfo);
            obj.name = 'resource';
            obj.time = new Date().getTime();
            obj.msg = e.target.localName + 'is load error';
            obj.data = {
                target: e.target.localName,
                type: e.type,
                resource: e.target.currentSrc
            }
            if (e.target !== window) errorList.push(data);
        }, true);
        // js
        window.onerror = function(msg, url, line, col, error) {
            let obj = Object.assign({}, errorInfo);
            setTimeout(() => {
                obj.msg = error && error.stack ? error.stack.toString() : msg;
                obj.time = new Date().getTime();
                obj.data = {
                    url: url,
                    line: line,
                    col: col
                }
                errorList.push(obj);
            }, 0)
        }
        console.log('页面错误捕获列表：', errorList);
        uploadPageError(config);
        return errorList;
    }
    function uploadPageError (config) {
        // 将页面错误信息上报
        console.log(config);
    }
    global.detectError = _initError;
})(window);
