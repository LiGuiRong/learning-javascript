### 前言
由于HTTP是一个无状态协议，服务器不会在多个请求中维护客户信息，但是，用户的很多行为又需要明确客户信息，如登录态，购物车等应用场景，所以就有了cookie和session。

### cookie
#### cookie是什么
cookie是浏览器保存在用户本地的一段文本。在HTTP请求中，服务器会将一些重要信息以key-value的形式传给客户端并暂时保存在本地，这就是cookie，当用户再次发起请求时，cookie通过请求头再次又被完整的带回给服务器，服务器就可以根据这些信息来区分不同的用户。

> 也就是说，cookie是服务器传给客户端并保存在客户端的一段信息，因此cookie是有大小限制的

#### cookie的创建
- 服务器创建：用于通讯过程中的用户验证

- 浏览器创建：用于本地存储数据
1、可用escape对值进行加密，用unescape对值进行解密
2、使用分号对键值对进行区分
3、domain用于设置cookie可用的域名
4、expires用于设置cookie的有效时间
5、path用于设置路径，默认为当前文档路径
6、max-age用于设置最大可用时间
```js
function setCookie(key, value, expireHours) {
    let cookieStr = `${key}=${escape(value)};`;
    if (expireHours > 0) {
        let date = new Date();
        date.setTime(date.getTime() + expireHours * 3600 * 1000);
        cookieStr += `expires=${date.toGMTString()};`; 
    }
    document.cookie = cookieStr;
}
function getCookie(key) {
    if (!hasKey) {
        return '';
    }
    let cookiesArray = document.cookie.split(';');
    for (let i = 0; i < cookiesArray.length; i++) {
        let kv = cookiesArray[i].split('=');
        if (kv[0] === key) {
            return unescape(kv[1]);
        }
    }
    return '';
}
function removeCookie(key) {
    if (!hasKey) return false;
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    return true;
}
function hasKey(key) {
    let cookieStr = document.cookie;
    if (cookieStr.indexOf(key + '=') > -1) {
        return true;
    } else {
        return false;
    }
}
```

### session
session是基于cookie来工作的。当客户端发起请求时，服务器设置一个ID并保存一些用户信息，并把这个ID通过cookie传给客户端，客户端之后每次和服务器通讯时只需要传递这个ID值就可以维持与服务器直接的状态，这个ID通常被是NAME为JSESSIONID的一个cookie。


### 参考
[深入分析Session和Cookie](https://juejin.im/post/5b7c1f4d6fb9a019f221ca14)
[document.cookie的使用](https://www.cnblogs.com/PopularProdigal/p/7495226.html)
[Document.cookie](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie)
