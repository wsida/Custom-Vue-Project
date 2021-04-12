import store from '@/store'
import { PERMIT_FUNC_OPEN } from '@/config/index'

const normalPermissions = (permission) => {
  if (!permission) return []
  if (Array.isArray(permission)) return permission
  return [permission]
}

export default function havePermission (permission) {
  if (!PERMIT_FUNC_OPEN) return true
  const permissions = normalPermissions(permission)
  return permissions.some(code => store.state.user.funcs.indexOf(code) !== -1)
}
