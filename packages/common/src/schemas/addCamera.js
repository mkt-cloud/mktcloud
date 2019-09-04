import * as yup from 'yup'

export const nameErrors = {
  required: 'Ein Name muss angegeben werden',
  min: 'Der Name muss mindestens 3 Zeichen haben',
  max: 'Der Name kann maximal 128 Zeichen haben',
}
export const addressErrors = {
  required: 'Eine Adresse muss angegeben werden',
  url: 'Die Adresse ist keine gültige URL',
  whitespace: 'Die Adresse darf kein Leerzeichen enthalten',
  local:
    'Nutzen sie nur öffentliche Adressen. Lokale Adressen sind nicht aus dem Internet zu erreichen und unzulässig',
}
export const portErrors = {
  required: 'Ein Port muss angegeben werden',
  min: 'Ein Port muss positiv sein',
  max: 'Ein Port kann maximal 65535 lauten',
}

export const matchesIpv4s = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
export const matchesPrivateIpv4s = /^(^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.).*$/
export const matchesIpv6s = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/
export const matchesPrivateIpv6s = /^[0:]+1$/
export const matchesHostnames = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/

export const hostValidation = yup
  .string()
  .required(addressErrors.required)
  .trim()
  .test('is-valid-host', addressErrors.url, host => {
    const isIpv4 = yup
      .string()
      .matches(matchesIpv4s)
      .isValidSync(host)
    const isIpv6 = yup
      .string()
      .matches(matchesIpv6s)
      .isValidSync(host)
    const isHostname = yup
      .string()
      .matches(matchesHostnames)
      .isValidSync(host)

    return isIpv4 || isIpv6 || isHostname
  })
  .test('is-public-host', addressErrors.local, host => {
    const isLocalIpv4 = yup
      .string()
      .matches(matchesPrivateIpv4s)
      .isValidSync(host)
    const isLocalIpv6 = yup
      .string()
      .matches(matchesPrivateIpv6s)
      .isValidSync(host)

    return !(isLocalIpv4 || isLocalIpv6)
  })

export const portValidation = yup
  .number()
  .min(0, portErrors.min)
  .max(65535, portErrors.max)

export default yup
  .object()
  .required()
  .shape({
    name: yup
      .string()
      .required(nameErrors.required)
      .min(3, nameErrors.min)
      .max(128, nameErrors.max),
    address: hostValidation,
    usr: yup.string().ensure(),
    pwd: yup.string().ensure(),
    http: portValidation.required(addressErrors.required),
    rtsp: portValidation,
  })
