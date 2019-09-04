import login, { emailValidation as eV } from './login'
import profile from './profile'
import register from './register'
import addCamera, {
  hostValidation as hV,
  portValidation as pV,
  matchesIpv4s,
  matchesPrivateIpv4s,
  matchesIpv6s,
  matchesPrivateIpv6s,
  matchesHostnames,
} from './addCamera'

export const loginSchema = login
export const registerSchema = register
export const profileSchema = profile
export const addCameraSchema = addCamera

export const hostValidation = hV
export const portValidation = pV
export const emailValidation = eV

export const ipv6Regex = matchesIpv6s
export const ipv4Regex = matchesIpv4s
export const privateIpv4Regex = matchesPrivateIpv4s
export const privateIpv6Regex = matchesPrivateIpv6s
export const hostnameRegex = matchesHostnames

export default {
  loginSchema,
  profileSchema,
  registerSchema,
  addCameraSchema,

  hostValidation,
  portValidation,
  emailValidation,

  ipv6Regex,
  ipv4Regex,
  privateIpv4Regex,
  privateIpv6Regex,
  hostnameRegex,
}
