import { PERMISSION } from '../constants'
import { AuthenticationError } from 'apollo-server'

const checkPermission = (permissions, id) =>
  permissions && permissions.cameras && permissions.cameras.includes(id)
    ? PERMISSION.FULL
    : PERMISSION.NONE

export const hasPermission = (allowedPermissions = []) => (
  permissions,
  id,
) => funcCreator => {
  const permission = checkPermission(permissions, id)
  if (allowedPermissions.includes(permission))
    return funcCreator(permissions._id, id, permission)
  throw new AuthenticationError()
}

export const canRead = hasPermission([PERMISSION.READ, PERMISSION.FULL])
export const canWrite = hasPermission([PERMISSION.FULL])
export const block = () => () => {
  throw new AuthenticationError()
}

export const isLoggedIn = permissions => funcCreator => {
  if (permissions && permissions._id) return funcCreator(permissions._id)
  throw new AuthenticationError()
}

export default { hasPermission, isLoggedIn, canRead, canWrite, block }
