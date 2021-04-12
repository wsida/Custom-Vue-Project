import havePermission from '@/utils/permission'

export default {
  inserted (el, binding, vnode) {
    const expression = binding.expression
    const permission = vnode.context.expression || expression
    if (!havePermission(permission)) {
      el.parentNode && el.parentNode.removeChild(el)
      vnode.context.$destroy && vnode.context.$destroy()
    }
  }
}
