### 前言
HTTP报文是浏览器和服务器之间通讯时发送和响应的数据块。浏览器向服务器发送请求数据，发送请求报文（request），服务器向浏览器返回数据，返回响应报文（response）。

报文信息主要包含两部分：
- 包含属性的首部（header）：附加信息及与缓存相关的规则信息都在header中。
- 数据的主体部分（body）：HTTP请求真正想要传输的部分。

浏览器第一次请求资源时示意图
![第一次请求](../image/strange-cache.png)
浏览器再次请求资源时示意图
![第二次请求](../image/compare-cache.png)

### Expire
Expire的值是服务器返回的到期时间，及下一次请求时，请求时间小于Expire设置的时间，则直接使用缓存数据。

### Cache-Control
Cache-Control是最重要的规则。常见的取值有private，public，no-cache，max-age，no-store，默认值为private。
- private：客户端可以缓存
- public：客户端和代理服务器都可以缓存
- max-age：缓存的内容将在XXX秒后失效
- no-cache：需要使用 **对比缓存** 来验证缓存数据
- no-store：所有内容都不会缓存，强制缓存和对比缓存都不会触发

> 对比缓存
> 顾名思义，需要进行比较判断是否可以使用缓存
> 浏览器第一次请求数据时，服务器会将缓存标识和数据一起返回给客户端，客户端将两者备份至数据库中。再次请求的时候，客户端将备份的缓存标识发送给服务器，服务器根据缓存标识进行判断，判断成功后，返回304状态码，通知客户端比较成功，可以使用缓存数据。

### Last-Modified/If-Modified-Since
- Last-Modified
服务器在响应请求的时候告诉浏览器资源的最后修改时间。

- If-Modified-Since
再次请求的时候，客户端通过If-Modified-Since通知服务器上次请求时间，服务器发现请求头有If-Modified-Since则与被请求的资源的最后修改时间进行比较，若修改时间大于If-Modified-Since说明已经被改过，则返回新的内容，返回状态码200。若最后修改时间小于或等于If-Modified-Since，则说明资源没有被修改，则响应HTTP 304，告知浏览器使用缓存。

### Etag/If-None-Match(优先级高于Last-Modified/If-Modified-Since)
- Etag
服务器响应请求时，告诉浏览器当前资源在服务器的唯一标识（生成规则由服务器决定）

- If-None-Match
再次请求时，通过此字段If-None-Match通知服务器客户端缓存数据的唯一标识。服务器收到请求后发现请求头有If-None-Match则与被请求的资源的唯一标识进行对比，不同则说明资源被改动过，则返回新的内容，返回状态码200。相同，则说明资源无新修改，则响应HTTP 304，告知浏览器使用缓存。

### 总结
- 强制缓存（Expire，Cache-Control）：服务器通知浏览器一个缓存时间，在缓存时间内，下次请求直接用缓存，不在时间内，执行比较缓存策略。
- 对比缓存（Last-Modified，Etag）：将缓存信息中的标签（Last-Modified或Etag）通过请求头发送给服务器，由服务器校验，返回304状态码时，直接使用缓存

### 参考资料
[彻底弄懂HTTP缓存机制及原理](https://www.cnblogs.com/chenqf/p/6386163.html)
