export function jsonp(options) {
    options = options || {};

    if (!options.url || !options.callback) {
        throw new SyntaxError('参数错误');
    }

    let cbName = ('jsonp_' + Math.random()).replace('.', '');
    let oHead = document.getElementsByTagName('head')[0];
    options.data[options.callback] = cbName;
    let params = formatParams(options.data);
    let script = document.createElement('script');
    oHead.appendChild(script);

    window[cbName] = function(json) {
        oHead.removeChild(script);
        clearTimeout(script.timer);
        window[cbName] = null;
        options.success && options.success(json);
    }

    script.src = options.url + '?' + params;
    
    if (options.time) {
        script.timer = setTimeout(function() {
            window[cbName] = null;
            oHead.removeChild(script);
            options.fail && options.fail();
        }, options.time);
    }
}

function formatParams(data) {
    let arr = [];
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
    }
    return arr.join('&');
}