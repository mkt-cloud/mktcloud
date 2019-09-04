export const ADDED = 'ADDED'
export const REMOVED = 'REMOVED'
export const UPDATED = 'UPDATED'
export const GET = 'GET'
export const RESET_PASSWORD_MAIL = 'RESET_PASSWORD_MAIL'
export const RESET_PASSWORD = 'RESET_PASSWORD'
export const LOGIN = 'LOGIN'
export const SHOT = 'SHOT'

export const STATUS_DELETED = 404
export const STATUS_DELETED_STRING = 'DELETED'
export const STATUS_DEFAULT = 200
export const STATUS_DEFAULT_STRING = 'DEFAULT'

export const PERMISSION_NONE = 'NONE'
export const PERMISSION_READ = 'READ'
export const PERMISSION_FULL = 'FULL'
export const PERMISSION_ADMIN = 'ADMIN'

export const PLAN_FREE = 'FREE'
export const PLAN_PREMIUM = 'PREMIUM'

export const PLAN = {
  FREE: PLAN_FREE,
  PREMIUM: PLAN_PREMIUM,
}

export const STATUS = {
  [STATUS_DEFAULT_STRING]: STATUS_DEFAULT,
  [STATUS_DELETED_STRING]: STATUS_DELETED,
}
export const STATUS_BY_CODE = {
  [STATUS_DEFAULT]: STATUS_DEFAULT_STRING,
  [STATUS_DELETED]: STATUS_DELETED_STRING,
}

export const PERMISSION = {
  NONE: PERMISSION_NONE,
  READ: PERMISSION_READ,
  FULL: PERMISSION_FULL,
  ADMIN: PERMISSION_ADMIN,
}

export const compose = (...args) => args.join('_')

export default {
  STATUS,
  STATUS_BY_CODE,
  PERMISSION,
  ADDED,
  REMOVED,
  UPDATED,
  GET,
  compose,
}
