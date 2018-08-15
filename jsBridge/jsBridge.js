/**
 * callback 这个唯一标识是整个回调逻辑的关键；用一个自增的唯一ID来标识存储回调函数，
 * 并把此ID以参数形式传递给native，而native也以此ID作为回溯的标识，这样既可实现
 * callback回调逻辑。
 */

(function() {
    var id = 0, callbacks = {}, registerFuns = {};

    window.jsBridge = {
        // 调用native
        invoke: function(bridgeName, callback, data) {
            var thisId = id ++; //获取唯一的ID
            callbacks[thisId] = callback; // 将callback函数存储在本地，将ID传给native并回溯
            nativeBridge.postMessage({
                bridgeName: bridgeName,
                data: data || {},
                callbackId: thisId
            });
        },
        // 接收native消息
        receiveMessage: function(msg) {
            var bridgeName = msg.bridgeName,
                data = msg.data || {},
                callbackId = msg.callbackId, // native将callbackId原封不动传回，根据该ID去事件队里中执行对应的回调
                responstId = msg.responstId;
            
            // 具体逻辑,callbackId和bridgeName不会同时存在
            if (callbackId) { // 通过native回溯拿到该ID对应的函数并执行之
                if (callbacks[callbackId]) { // 找到对应句柄
                    callbacks[callbackId](msg.data); // 执行句柄
                }
            } else if (bridgeName) {
                if (registerFuns[bridgeName]) {
                    var ret = {}, flag = false;
                    registerFuns[bridgeName].forEach((callback) => {
                        callback(data, function(r) {
                            flag = true;
                            ret = Object.assign(ret, r);
                        })
                    });
                    if (flag) {
                        nativeBridge.postMessage({
                            responstId: responstId,
                            ret: ret
                        });
                    }
                }
            }
        },
        register: function(bridgeName, callback) {
            if (!registerFuns[bridgeName]) {
                registerFuns[bridgeName] = [];
            }
            registerFuns[bridgeName].push(callback);
        }
    }
})();

/**
 * native 端的主要逻辑：
 * 1、接收JavaScript的消息
 * 2、解析参数，拿到bridgeName，data，callbackId
 * 3、根据bridgeName找到功能方法，以data为参数执行方法
 * 4、把执行结果和callbackId一起传回前端JavaScript
 * 5、前端JavaScript根据callbackId找到存储在callbacks里的回调函数，
 * 并把结果给到对应的回调函数执行之。
 */

