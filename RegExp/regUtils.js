/**
 * replce的第二个参数可以是字符串或者函数
 * 
 * 当第二个参数是函数时，函数接受的参数如下
 * (1) result: 本次匹配到的结果
 * (2) $1,...$9: 正则表达式中有几个()，就会传递几个参数，$1~$9分别代表本次匹配中每个()提取的结果，最多9个
 * (3) offset:记录本次匹配的开始位置
 * (4) source:接受匹配的原始字符串
 * 
 * 匹配到的表达式会替换为第二个参数返回的值
 * 
 */


/**
 * @description 该函数是讲 get-element-by-id 格式的字符串转化为驼峰模式
 * @param {*} str 
 */
function toCamelCase(str) {
  let pattent = /-([a-z])/g
  return str.replace(pattent, (result, $1, offset, source) => {
    console.log(result, $1, offset, source)
    return $1.toUpperCase()
  })
}

function getUrlParamsObj() {
  let params = {}
  // 获取URL的参数，格式如下"name=zhangsan&age=21&sex="
  let serach = window.location.search.substr(1)
  // +表示一个以上，*表示任意数量，key一定要有值，value可以为空
  let pattent = /([^&=]+)=([^&=]*)/g
  serach.replace(pattent, (result, $1, $2, offset, source) => {
    console.log(result, $1, $2, offset, source)
    params[$1] = $2
  })
  return params
}