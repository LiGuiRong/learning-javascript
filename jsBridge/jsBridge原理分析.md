### 两种实现JSBridge的方式
- 重写JavaScriptInterface接口
- WebView拦截所有URL请求做处理

### 原理
- 注入API
> 注入API的原理是：通过webview提供的接口，向JavaScript的上下文（一般是window对象）注入对象或方法，当JavaScript调用时，会直接执行相应的native代码逻辑，达到JavaScript调用native的目的

Android中可以使用下面方式实现在JavaScript上下文注入对象或方法。该方法在Android 4.2之前存在安全漏洞，如果不需要兼容4.2以下版本则可以使用该方法。
```java
public class JavaScriptInterfaceDemoActivity extends Activity{
    private WebView Wv;

    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        Wv = (WebView)findViewById(R.id.webView);     
        final JavaScriptInterface myJavaScriptInterface = new  JavaScriptInterface(this);

        Wv.getSettings().setJavaScriptEnabled(true);
        Wv.addJavascriptInterface(myJavaScriptInterface, "nativeBridge");

        // TODO 显示 WebView
    }

    public class JavaScriptInterface{
        Context mContext;
        
        JavaScriptInterface(Context c) {
            mContext = c;
        }

        public void postMessage(String webMessage){	    	
            // Native 逻辑
        }

        @JavascriptInterface
        public void showToast(String toast) {
            Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
        }
    }
}
```

前端调用如下
```js
window.nativeBridge.postMessage(message);
window.nativeBridge.showToast(message);
```

- schema伪连接请求
url schema是一种类似于URL的链接，是 **为了方便APP直接互相调用** 设计的，形式和普通的URL近似，主要区别是protocol和host一般是自定义的，例如myapp://dbank/url?url=***,protocol是myapp，host则是dbank。

> 拦截schema的主要流程：web通过某种方式发起请求（iframe.url），native拦截请求并解析URL参数，根据执行对应操作。

> webview能够监听到任何的请求
> 不使用localtion.href的原因是多次触发location.href的时候，只会触发最后一次，导致部分请求缺失。

```js
let iframe = document.createElement('iframe');
iframe.style.display = 'none';
iframe.src = schema;

let body = document.body;
body.appendChild(iframe);

// 发起请求后需要移测iframe,不然会导致页面中有很多iframe
setTimeout(() => {
    body.removeChild(iframe);
    iframe = null;
}, 100);
```

Android中所有的URL跳转都可以使用WebViewClient.shouldOverrideUrlLoading()方法实现拦截，通过判断URL的格式，如果是schema格式，则可以执行自身的逻辑了；
```java
public class CustomWebViewClient extends WebViewClient {

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        if (isJsBridgeUrl(url)) {
            // JSbridge的处理逻辑
            return true;
        }
        return super.shouldOverrideUrlLoading(view, url);
    }
}
```

schema缺点：
1、HTTP协议对URL长度有限制，超过4M无法提交
2、创建请求，需要一定的时耗，比注入API的方式耗时

- javascript 调用 Java 有四种方法
1、JavaScriptInterface
> 见上文
2、WebView.shouldOverrideUrlLoading()

3、WebChromeClient.onConsoleMessage()
> 当执行console.log或者window.prompt函数的时候，上下两个方法就会得到回调。
4、WebChromeClient.onJsPrompt()

- Java 调用 JavaScript
Java调用JavaScript只有一种方式，那就是调用WebView.loadUrl去执行一个预定好的方法。
```java
WebView.loadUrl(String.format("javascript:nativeBridge.handleMessage(%s)", data));
```
