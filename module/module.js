/**
 * 兼容AMD，CMD，commonJS等模块化规范
 */
(function(global, factory) {
    if (typeof exports == 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        this.eventUtil = factory(); // eventUtil为对外暴露的接口名称
    }
})(this, function() {
    // define module;
});