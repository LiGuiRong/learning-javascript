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