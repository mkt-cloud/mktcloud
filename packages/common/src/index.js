import {
  loginSchema,
  registerSchema,
  profileSchema,
  addCameraSchema,
  hostValidation,
  portValidation,
  emailValidation,
  ipv6Regex,
  ipv4Regex,
  privateIpv4Regex,
  privateIpv6Regex,
  hostnameRegex,
} from './schemas'

export const schemas = {
  loginSchema,
  registerSchema,
  profileSchema,
  addCameraSchema,
}
export const validations = { hostValidation, portValidation, emailValidation }

export const regexs = {
  ipv6Regex,
  ipv4Regex,
  privateIpv4Regex,
  privateIpv6Regex,
  hostnameRegex,
}

export default {
  regexs,
  schemas,
  validations,
}
