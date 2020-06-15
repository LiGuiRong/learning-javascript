let Vue;

function forEach(params, cb) {
  Object.keys(params).forEach((key) => {
    cb(key, params[key])
  })
}

// module收集逻辑
class ModulesCollection {
  constructor(options) {
    this.register([], options)
  }
  register(path, rootModule) {
    let rawModule = {
      _raw: rootModule,
      _children: {},
      _state: rootModule.state
    }
    
    if (!this.root) {
      this.root = rawModule
    } else {
      // [a,b] 获取a中的b module
      let parentModule = path.slice(0, -1).reduce((root, current) => {
        return root._children[current];
      }, this.root)
      parentModule._children[path[path.length -1]] = rawModule
    }

    if (rootModule.modules) {
      forEach(rootModule.modules, (moduleName, module) => {
        this.register(path.concat(moduleName), module)
      })
    }

  }
}

function installModules(store, rootState, path, rawModule) {
  if (path.length) {
    let parentState = path.slice(0, -1).reduce((root, current) => {
      return root[current]
    }, rootState)
    Vue.set(parentState, path[path.length -1], rawModule.state)
  }

  let getters = rawModule._raw.getters
  if (getters) {
    forEach(getters, (getterName, value) => {
      Object.defineProperty(store.getters, getterName, {
        get() {
          return value(rawModule.state) // 模块中的状态
        }
      })
    })
  }

  let mutations = rawModule._raw.mutations
  if (mutations) {
    forEach(mutations, (mutationName, value) => {
      let arr = store.mutations[mutationName] || ( store.mutations[mutationName] = [])
      arr.push((payload) => {
        value(rawModule.state, payload)
      })
    })
  }

  let actions = rawModule._raw.actions
  if (actions) {
    forEach(actions, (actionName, value) => {
      let arr = store.actions[actionName] || ( store.actions[actionName] = [])
      arr.push((payload) => {
        value(store, payload)
      })
    })
  }

  forEach(rawModule._children, (moduleName, rawModule) => {
    installModules(store, rootState, path.concat(moduleName), rawModule)
  })
}

class Store {
  constructor(options) {
    this.vm = new Vue({
      data: {
        state: options.state
      }
    })

    this.getters = {}
    this.mutations = {}
    this.actions = {}
    
    // 格式化用户输入数据
    this.modules = new ModulesCollection(options)
    // 递归安装模块 store/rootState/path/跟模块
    installModules(this, this.state, [], this.modules.root)
  }

  get state() {
    return this.vm.state
  }
  
  commit = (mutationName, payload) => {
    this.mutations[mutationName].forEach(fn => fn(payload))
  }
  
  dispatch = (actionName, payload) => {
    this.actions[actionName].forEach(fn => fn(payload))
  }
  
  registerModule(moduleName, module) {
    if (!Array.isArray(moduleName)) {
      moduleName = [moduleName]
    }
    this.modules.register(moduleName, module)
    installModules(this, this.state, moduleName, this.modules.root[moduleName])
  }
}


new Store({
  state: {
    a: "a100",
  },
  mutations: {
    getStateA(state, payload) {
      return state.a = state.a + payload
    }
  },
  actions: {
    setStateA({commit}, payload) {
      commit('getStateA', payload)
    }
  },
  modules: {
    b: {
      state: {
        a: "b100",
      },
      mutations: {
        getStateA(state, payload) {
          return state.a = state.a + payload
        }
      },
      actions: {
        setStateA({commit}, payload) {
          commit('getStateA', payload)
        }
      }
    }
  }
})


// 根据表达式获取对象的值
// function getObjectValue (obj, arr) {
//   if (typeof arr === 'string') {
//     arr = arr.split('.')
//   }
//   return arr.reduce((preVal, currVal) => {
//     return preVal[currVal]
//   }, obj)
// }

// let obj = {
//   a: {
//     b: {
//       c: {
//         d: 1
//       }
//     }
//   }
// }

// getObjectValue(obj, ['a','b', 'c', 'd'])
// getObjectValue(obj, 'a.b.c.d')