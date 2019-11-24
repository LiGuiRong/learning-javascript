function Mue(options = {}) {
    this.vm = this;
    this.$options = options;
    this._data = options.data || {};
    this.methods = options.methods || {};

    // 将options.data上的属性代理到this上
    Object.keys(this._data).forEach(key => {
        this.proxyKeys(key);
    });

    // 响应式数据
    observe(this._data);
    // 编译
    new Compile(options.el, this);
}

Mue.prototype.proxyKeys = function(key) {
    Object.defineProperty(this, key, {
        get() {
            return this._data[key];
        },
        set(newVal) {
            this._data[key] = newVal;
        }
    });
}

// 使用Object.defineProperty来添加数据双向绑定
function observe(data = {}) {
    if (typeof data !== 'object') return;
    return new Observe(data);
}

function Observe(data = {}) {
    this.walk(data);
}

Observe.prototype = {
    walk(data) {
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key]);
        });
    },
    defineReactive(obj, key, value) {
        let dep = new Dep();
        let child = observe(value);
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get() {
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }
                return value;
            },
            set(newVal) {
                if (newVal === value) return;
                value = newVal;
                dep.notify();
            } 
        });
    }
}

// 观察者
function Dep() {
    this.subs = [];
}

Dep.prototype = {
    addSub(sub) {
        this.subs.push(sub);
    },
    notify() {
        this.subs.forEach(sub => {
            sub.update();
        });
    }
}

// 全局属性，确保当前只有一个属性被观察者
Dep.target = null;

// 订阅者
function Watcher(vm, exp, fn) {
    this.vm = vm;
    this.exp = exp;
    this.fn = fn;
    this.value = this.get();
}

Watcher.prototype = {
    update() {
        this.run();
    },
    run() {
        let value = this.vm._data[this.exp];
        let oldValue = this.value;
        if (value !== oldValue) {
            this.value = value;
            this.fn.call(this.vm, value, oldValue);
        }
    },
    get() {
        Dep.target = this;
        let value = this.vm._data[this.exp];
        Dep.target = null;
        return value;
    }
}

// 文档片段会在内存中计算，并且不会导致dom回流，可以提高性能。
function nodeToFragment(node) {
    let fragment = document.createDocumentFragment();
    while(child = node.firstChild) {
        fragment.appendChild(child);
    }
    return fragment;
}

// 编译函数
function Compile(el, vm) {
    this.el = document.querySelector(el);
    this.vm = vm;
    this.fragment = null;
    this.initCompile();
}

Compile.prototype = {
    initCompile() {
        if (this.el) {
            this.fragment = nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        } else {
            console.error('挂载节点元素el不存在，请确保已经传入el属性');
        }
    },
    // 编译元素
    compileElement(node) {
        let childNodes = node.childNodes;
        // childNodes是一个类数组，需要转换成数组
        // 遍历所有子节点
        Array.from(childNodes).forEach(childNode => {
            let reg = /\{\{(.*)\}\}/;
            let text = childNode.textContent;

            // 对元素节点和文本节点分别处理
            if (this.isElementNode(childNode)) {
                this.compile(childNode);
            } else if (this.isTextNode(childNode) && reg.exec(text)) {
                this.compileText(childNode, reg.exec(text)[1]);
            }

            // 递归遍历
            if (childNode.childNodes && childNode.childNodes.length) {
                this.compileElement(childNode);
            }
        });
    },
    compile(node) {
        let attrs = node.attributes;
        Array.from(attrs).forEach(attr => {
            let name = attr.name;
            // 如果该属性是自定义指令属性
            if (this.isDirective(name)) {
                let exp = attr.value;
                let dir = name.substring(2);

                if (this.isEventDirective(dir)) {
                    this.compileEvent(node, this.vm, exp, dir);
                } else {
                    this.compileMode(node, this.vm, exp, dir);
                }
                
                // 避免每次编译都重复添加事件
                node.removeAttribute(name);
            }
        });
    },
    compileText(node, exp) {
        let initText = this.vm[exp];
        this.updateText(node, initText);
        // 添加监听依赖, 这样每次有属性跟新的时候，视图也会跟新
        new Watcher(this.vm, exp, (value) => {
            this.updateText(node, value);
        });
    },
    updateText(node, text) {
        node.textContent = typeof text === 'undefined' ? '' : text;
    },
    compileEvent(node, vm, exp, dir) {
        let eventType = dir.split(':')[1];
        let cb = vm.methods && vm.methods[exp];
        if (eventType && cb) {
            node.addEventListener(eventType, cb.bind(vm), false);
        }
    },
    compileMode(node, vm, exp, dir) {
        let self = this;
        // 初始化时显示设置的值
        let value = vm[exp];
        this.updateModeText(node, value);

        // 添加监听依赖, 这样每次有属性跟新的时候，视图也会跟新
        new Watcher(vm, exp, (value) => {
            self.updateModeText(node, value);
        });

        // 添加监听事件
        node.addEventListener('input', (e) => {
            let newValue = e.target.value;
            if (value === newValue) return;
            vm[exp] = newValue;
            value = newValue;
        }, false);
    },
    updateModeText(node, value) {
        node.value = typeof value === 'undefined' ? '' : value;
    },
    isDirective(attr) {
        return attr.indexOf('v-') === 0;
    },
    isElementNode(node) {
        return node.nodeType === 1;
    },
    isTextNode(node) {
        return node.nodeType === 3;
    },
    isEventDirective(dir) {
        return dir.indexOf('on:') === 0;
    }
}