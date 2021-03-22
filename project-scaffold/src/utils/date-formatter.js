// 日期格式化
const timeUnit = {
  d: 24 * 60 * 60 * 1000,
  h: 60 * 60 * 1000,
  m: 60 * 1000,
  s: 1000
}
// 格式化时间
/**
 * @param {*} date
 * @param {*} format
 * YYYY -年
 * MM -月
 * dd -日
 * HH -24小时
 * mm -分钟
 * ss -秒
 */
export const dateFormat = (date, format) => {
  if (!date) return date
  const datetime = new Date(date)
  const opt = {
    'Y+': datetime.getFullYear().toString(),
    'M+': (datetime.getMonth() + 1).toString(),
    'd+': datetime.getDate().toString(),
    'H+': datetime.getHours().toString(),
    'm+': datetime.getMinutes().toString(),
    's+': datetime.getSeconds().toString()
  }
  Object.keys(opt).forEach(k => {
    const ret = new RegExp('(' + k + ')').exec(format)
    if (ret) {
      format = format.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  })
  return format
}

// 获取时间戳
export const getDateTime = (date) => {
  if (!date) return date
  return new Date(date).getTime()
}

/**
 * 时间加
 * @param {*} date
 * @param {*} exp 表达式，数字 加 单位后缀 d、h、m、s
 * @returns unix
 */
export const addDate = (date, exp) => {
  if (!date) return date
  const datetime = getDateTime(date)
  const type = exp.slice(-1, -2)
  if (!exp || Object.keys(timeUnit).indexOf(type) === -1) return datetime
  return datetime + parseFloat(exp) * timeUnit[type]
}

/**
 * 时间减
 * @param {*} date
 * @param {*} exp 表达式，数字 加 单位后缀 d、h、m、s
 * @returns unix
 */
export const subDate = (date, exp) => {
  if (!date) return date
  const datetime = getDateTime(date)
  const type = exp.slice(-1, -2)
  if (!exp || Object.keys(timeUnit).indexOf(type) === -1) return datetime
  return Math.max(0, datetime - parseFloat(exp) * timeUnit[type])
}
