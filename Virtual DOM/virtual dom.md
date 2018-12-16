### virtual dom是什么
本质上来说，virtual dom只是一个简单的js对象，并且最少包含标签名tag，属性props，和子元素children三个属性。

```js
// virtual dom示例
{
    tag: 'div',
    props: {},
    children: [
        "hello world",
        {
            tag: 'ul',
            props: {},
            children: [
                {
                    tag: 'li',
                    props: {
                        id: 'item',
                        class: 'item-1'
                    },
                    children: ['one', 1]
                }
            ]
        }
    ]
}
```

virtual dom 跟dom是一一对应的，上面的virtual dom对应生成的dom如下
```html
<div>
    hello world
    <ul>
        <li id='item' class="item-1">
            one 1
        </li>
    </ul>
</div>
```

一个dom对象，比如li，由tag（li），props（{id: 'item', class: 'item-1'}）,和children（['one', 1]）三个属性来描述。

### 为什么需要virtual dom
减少页面重排次数，提高页面渲染的速度

### virtual dom与真实dom的映射


### diff算法
使用virtual dom的框架，一般的设计思路都是页面等于页面状态的映射，即**UI = render（state）**。当需要更新页面的时候，无需关心dom的具体变换方式，只需改变state即可。当state发生变化的时候，我们重新生产整个virtual dom，触发比较的操作，上述过程分为以下四步：
- state变化，生成新的virtual dom
- 比较新virtual dom与老virtual dom的区别
- 生成差异对象（patch）
- 遍历差异对象并更新dom

差异对象与每一个virtual dom一一对应，其结构如下
```js
{
    type,
    vdom,
    props:[{
        type,
        key,
        value
    }],
    children
}
```
最外层的type对应的dom元素的操作类型，有四种：新建，删除，替换和更新。props变化的type只有两种：更新和删除。
```js
const nodePatchTypes = {
    CREATE: 'create node',
    REMOVE: 'remove node',
    REPLACE: 'replace node',
    UPDATE: 'update node'
}

const propsPatchTypes = {
    REMOVE: 'remove prop',
    UPDATE: 'update prop'
}

function createElement (vdom) {
    if (typeof vdom === 'string' || typeof vdom === 'number') {
        return document.createTextNode(vdom);
    }

    const {tag, props, children} = vdom;

    const element = document.createElement(tag);

    setProps(element, props);

    children.map(createElement).forEach(element.appendChild.bind(element));

    return  element;
}

function setProps(element, props) {
    for (let key in props) {
        element.setAttribute(key, props[key]);
    }
}

function diff(oldVDom, newVDom) {
    // create
    if (oldVDom == undefined) {
        return {
            type: nodePatchTypes.CREATE,
            vdom: newVDom
        }
    }

    // remove
    if (newVDom == undefined) {
        return {
            type: nodePatchTypes.REMOVE,
        }
    }

    // replace
    if (
        typeof oldVDom !== typeof newVDom || 
        ((typeof oldVDom === 'string' || typeof newVDom === 'number') && newVDom !== oldVDom) || 
        oldVDom.tag !== newVDom.tag
    ) {
        return {
            type: nodePatchTypes.REPLACE,
            vdom: newVDom
        }
    }

    // update
    if (oldVDom.tag) {
        // compare props
        const propsDiff = diffProps(oldVDom, newVDom);

        // compare children
        const childrenDiff = diffChildren(oldVDom, newVDom);

        // if props or children has been changed
        if (propsDiff.length > 0 || childrenDiff.some(patchObj => (patchObj !== undefined) )) {
            return {
                type: propsPatchTypes.UPDATE,
                props: propsDiff,
                children: childrenDiff
            }
        }

    }
}

function diffProps(oldVDom, newVDom) {
    const patchs = [];

    const allProps = {...oldVDom.props, ...newVDom.props};

    //获取新旧所有属性名后，再逐一判断新旧属性值
    Object.keys(allProps).forEach((key) => {
        const oldValue = oldVDom.props[key];
        const newValue = newVDom.props[key];

        // remove
        if (newValue == undefined) {
            patchs.push({
                type: propsPatchTypes.REMOVE,
                key
            });
        } else if (oldValue == undefined || oldValue !== newValue) { // update
            patchs.push({
                type: propsPatchTypes.UPDATE,
                key,
                newValue
            });
        }
    });

    return patchs;
}

function diffChildren(oldVDom, newVDom) {
    const patchs = [];

    const childLength = Math.max(oldVDom.children.length, newVDom.children.length);

    for (let i = 0; i < childLength; i++) {
        patchs.push(diff(oldVDom.children[i], newVDom.children[i]));
    }

    return patchs;
}

function patch(parent, patchObj, index=0) {
    if (!patchObj) return;

    if (patchObj.type === nodePatchTypes.CREATE) {
        return parent.appendChild(createElement(pathObj.vdom));
    }

    const element = parent.childNodes[index];
    
    if (patchObj.type === nodePatchTypes.REMOVE) {
        return parent.removeChild(element);
    }

    if (patchObj.type === nodePatchTypes.REPLACE) {
        return parent.replaceChild(createElement(pathObj.vdom), element);
    }

    if (patchObj.type === nodePatchTypes.UPDATE) {
        const {props, children} = patchObj;

        patchProps(element, props);

        children.forEach((patchObj, i) => {
            patch(element, patchObj, i);
        });
    }
}

function patchProps(element, props) {
    if (!props) return;

    props.forEach(patchObj => {
        if (patchObj.type === propsPatchTypes.REMOVE) {
            element.removeAttribute(patchObj.key);
        } else if ((patchObj.type === propsPatchTypes.UPDATE) {
            element.setAttribute(patchObj.key, patchObj.value);
        }
    });
}
```

