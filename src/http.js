/**
 * 创建XMLHttpRequest，适配IE浏览器
 */
function createXHR() {
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		return new ActiveXObject('Microsoft.XMLHTTP');
	}
	return 'NO Support XMLHttpRequest!'
}
/**
 * 获取变量的数据类型
 * @param  {any} val 任何类型的入参
 * @return {string}     该入参的数据类型
 */
function getType(val) {
    return Object.prototype.toString.call(val).replace(/\[object |\]/g, '');
}

/**
 * 判断入参是否为纯对象，函数，数组等类型的不为纯对象
 * @param  {any}  obj 任何类型的入参
 * @return {Boolean}     纯对象返回true，否则false
 */
function isPlainObject(obj) {
	return getType(obj) === 'Object';
}

/**
 * 将对象拼接成查询模式，如{a:1,b:2,c:'PAZ999'} 拼接成 "a=1&b=2&c=PAZ999"
 * @param  {object} obj 对象
 * @return {string}     格式化字符串
 */
function getQueryString(obj){
	let query = '';

	if (obj && this.getType(obj) === 'Object') {
		for (let key in obj) {
			// 本身属性而非原型链上的属性
			if (obj.hasOwnProperty(key)) {
				query += key + '=' + encodeURIComponent(obj[key]) + '&';
			}
		}
		return query.replace(/&$/, '');
	} else {
		console.log('Type Error!');
	}
}

/**
 * 封装ajax方法
 * @param  {Object} opts 入参配置对象
 * @return {Object}      返回结果
 */
function http(opts) {
	return new Promise(function(resolve, reject){
		let type = opts.type || 'GET';
		let url = opts.url;
		let data = opts.data;
		let async = opts.async || true;
		let timeout = opts.timeout;
		let contentType = opts.contentType;

		let xhr = createXHR();

		if (type.toUpperCase() === 'GET' && data && isPlainObject(data)) {
			url += '?' + getQueryString(data);
		}

		if (type.toUpperCase() === 'POST' && data && isPlainObject(data)) {
			if (!contentType || contentType === 'application/x-www-form-urlencoded') {
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				data = getQueryString(data);
			} else {
				xhr.setRequestHeader('Content-Type', 'application/json');
				data = JSON.stringify(data);
			}
		}

		xhr.open(url, data, async);

		xhr.onload = function() {
			if (xhr.status >= 200 && xhr.status < 300){
				let ctype = response.header.get('Content-Type');
				if (/^application\/json/.test(ctype)) {
					res = response.json();
				} else {
					res = response.text();
				}
				resolve(res);
			} else {
				reject(xhr.statusText);
			}
		}

		xhr.timeout = timeout || 10000;

		xhr.ontimeout = function() {
			reject('请求超时');
		}

		xhr.onerror = function() {
			reject('请求失败');
		}

		xhr.onabort = function() {
			reject('请求中断');
		}

		xhr.send(type.toUpperCase() === 'GET' ? null : data);
	});
}

/**
 * jsonp主要是通过script可以链接远程URL来实现跨域请求的
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
function jsonp(opts) {
	// 删除节点元素
    let removeElem = function(elem) {
        var parent = elem.parentNode;
        if(parent && parent.nodeType !== 11) {
            parent.removeChild(elem);
        }
    };

	let url = opts.url;
	let data = opts.data;
	let cb = opts.cb;
	let success = opts.success;

	url += '?' + getQueryString(data) + '&callback=' + cb;

	// 创建script标签
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.url = url;
	script.id ='id_' + cb;

	window[cb] = function(json) {
		// 销毁残留函数
		window[cb] = null;

		// 删除节点
		let sNode = document.querySelector('id_' + cb);
		removeElem(sNode);

		// 执行成功回调
		success(json);
	}

	// 在head里面插入script元素
	let head = document.querySelector('head');
	if (head && head[0]) {
		head[0].appendChild(script);
	}
}

/**
 * 暴露接口 get 和 post
 */
export default {
	get(opts) {
		opts.type = 'GET';
		return http(opts);
	},
	post(opts) {
		opts.type = 'POST';
		return http(opts);
	},
	jsonp(opts) {
		return jsonp(opts);
	}
}

