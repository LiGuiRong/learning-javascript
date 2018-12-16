### 前言
HTTP报文是浏览器和服务器之间通讯时发送和响应的数据块。浏览器向服务器发送请求数据，发送请求报文（request），服务器向浏览器返回数据，返回响应报文（response）。

报文信息主要包含两部分：
- 包含属性的首部（header）：附加信息及与缓存相关的规则信息都在header中。
- 数据的主体部分（body）：HTTP请求真正想要传输的部分。

浏览器第一次请求资源时示意图
![第一次请求](../image/strange-cache.png)
浏览器再次请求资源时示意图
![第二次请求](../image/compare-cache.png)

### 分类
浏览器有两种缓存方案：**强制缓存和协商缓存**
- 强制缓存：Expire和Cache-Control：max-age，**这两个属性都是用于设置缓存时效的**。
- 协商缓存：Last-Modified和Etag，这两个属性都是在第一次请求的时候服务器会返回一个标识，之后的请求中，会把该标识传送给服务器，服务器比对结果并将结果告知客户端。

### Expire
Expire是HTTP1.0的协议。Expire的值是服务器返回的到期时间，及下一次请求时，请求时间小于Expire设置的时间，则直接使用缓存数据。客户端和服务器的时间必须严格同步才能生效。

### Cache-Control
Cache-Control是最重要的规则。常见的取值有private，public，no-cache，max-age，no-store，默认值为private。
- private：客户端可以缓存
- public：客户端和代理服务器都可以缓存
- max-age：缓存的内容将在XXX秒后失效
- no-cache：需要使用 **缓存缓存** 来验证缓存数据
- no-store：所有内容都不会缓存，强制缓存和对比缓存都不会触发

> 协商缓存
> 顾名思义，需要进行比较判断是否可以使用缓存
> 浏览器第一次请求数据时，服务器会将缓存标识和数据一起返回给客户端，客户端将两者备份至数据库中。再次请求的时候，客户端将备份的缓存标识发送给服务器，服务器根据缓存标识进行判断，判断成功后，返回**304状态码**，通知客户端比较成功，可以使用缓存数据。

### Last-Modified/If-Modified-Since
- Last-Modified
服务器在响应请求的时候告诉浏览器资源的最后修改时间。

- If-Modified-Since
再次请求的时候，客户端通过If-Modified-Since通知服务器上次请求时间，服务器发现请求头有If-Modified-Since则与被请求的资源的最后修改时间进行比较，若修改时间大于If-Modified-Since说明已经被改过，则返回新的内容，返回状态码200。若最后修改时间小于或等于If-Modified-Since，则说明资源没有被修改，则响应HTTP 304，告知浏览器使用缓存。

### Etag/If-None-Match(优先级高于Last-Modified/If-Modified-Since)
- Etag
Etag是HTTP1.1新增的内容。服务器响应请求时，告诉浏览器当前资源在服务器的唯一标识（生成规则由服务器决定）

- If-None-Match
再次请求时，通过此字段If-None-Match通知服务器客户端缓存数据的唯一标识。服务器收到请求后发现请求头有If-None-Match则与被请求的资源的唯一标识进行对比，不同则说明资源被改动过，则返回新的内容，返回状态码200。相同，则说明资源无新修改，则响应HTTP 304，告知浏览器使用缓存。

### 前端缓存应用
更新文件版本后，前端如何取到最新的文件呢?答案就在使用webpack打包的时候，更新文件的路径，这样就相当于第一次访问这些资源，不存在缓存问题了。
```js
entry: {
    main: path.join(__dirname, './main.js'),
    vendor: ['react']
},
output: {
    path: path.join(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'bundle.[chunkhash].js'
}
```
webpack给我们提供了三种hash值计算方式：
- hash：跟整个项目的构建相关，构建生成的文件hash值都是一样的，只要项目里有文件改变，整个项目构建的hash值都会改变
- chunkhash: 根据不同的入口文件依赖解析构建对应的chunk，生成对应的hash值
- contenthash： 由文件内容生成的hash，内容不同生成的hash值不同。

在具体的使用时可以采用如下策略：
- html使用协商缓存
- 图片，js，css使用强制缓存，文件命名带上hash值。


### 总结
- 强制缓存（Expire，Cache-Control）：服务器通知浏览器一个缓存时间，在缓存时间内，下次请求直接用缓存，不在时间内，执行比较缓存策略。
- 协商缓存（Last-Modified，Etag）：将缓存信息中的标签（Last-Modified或Etag）通过请求头发送给服务器，由服务器校验，返回304状态码时，直接使用缓存

**强制缓存和协商缓存主要区别是使用本地缓存的时候，是否需要向服务器验证本地缓存是否有效。强制缓存不需要与服务器通讯，而协商缓存需要向服务器发起请求。304状态码就是用于协商缓存的，当不需要更新资源的时候会返回304状态码。**

### 参考资料
[彻底弄懂HTTP缓存机制及原理](https://www.cnblogs.com/chenqf/p/6386163.html)
