// 变量类型判断
export function isBoolean (value) {
  return Object.prototype.toString.call(value).toLowerCase() === '[object boolean]'
}

export function isObject (value) {
  return Object.prototype.toString.call(value).toLowerCase() === '[object object]'
}

export function isNumber (value) {
  return Object.prototype.toString.call(value).toLowerCase() === '[object number]'
}

export function isString (value) {
  return Object.prototype.toString.call(value).toLowerCase() === '[object string]'
}

export function isArray (value) {
  return Object.prototype.toString.call(value).toLowerCase() === '[object array]'
}

export function isUndefined (value) {
  return Object.prototype.toString.call(value).toLowerCase() === '[object undefined]'
}

export function isNull (value) {
  return Object.prototype.toString.call(value).toLowerCase() === '[object null]'
}
