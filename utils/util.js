/**
 * 列表搜索过滤工具
 * @param {Array} list - 原数组
 * @param {String} keyword - 搜索关键词
 * @param {Array} keys - (可选) 指定要搜索的字段名数组，如 ['name', 'phone']。如果不传，默认搜索对象所有属性。
 * @returns {Array} - 过滤后的新数组
 */
const filterList = (list, keyword, keys = []) => {
  // 1. 边界条件处理
  if (!list || !Array.isArray(list)) return []
  if (!keyword) return list // 关键词为空，返回原列表

  const lowerKeyword = String(keyword).toLowerCase() // 转小写

  return list.filter((item) => {
    // 2. 确定要搜索的字段范围
    // 如果没有指定 keys，就取对象的所有值；如果指定了，就只取指定的字段
    const targetValues =
      keys.length > 0 ? keys.map((key) => item[key]) : Object.values(item)

    // 3. 核心匹配逻辑
    return targetValues.some((val) => {
      // 排除 null 和 undefined，转为字符串比对
      if (val === null || val === undefined) return false
      return String(val).toLowerCase().includes(lowerKeyword)
    })
  })
}

const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(':')}`
}

const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime,
  filterList,
}
