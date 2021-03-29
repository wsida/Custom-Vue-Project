// 格式化工具集
const thousandFormatterRegex = /\B(?=(\d{3})+(?!\d))/g

/**
 * 整数部分转千分表示
 * @param {*} num 整数
 * @param {*} split 千分号
 */
export function toThousand (num, split = ',') {
  return typeof num !== 'number'
    ? num
    : num.toString().replace(thousandFormatterRegex, split)
}

/**
 * 小数点转百分号
 * @param {*} decimal 小数
 * @param {*} point 保留小数点
 * @param {*} type 转换的类型 1-字符串 0-数字
 */
export function toPercentage (decimal, point = 1, type = 1) {
  if (typeof decimal !== 'number' || point < 0) return decimal
  const percentage = decimal === 0 ? 0 : (Math.round(decimal * Math.pow(10, 2 + point)) / Math.pow(10, point)).toFixed(point)
  return type === 1
    ? percentage.toString() + '%'
    : point > 0
      ? parseFloat(percentage)
      : parseInt(percentage, 10)
}
