import * as yup from 'yup'
import addCameraSchema, {
  matchesIpv4s,
  matchesIpv6s,
  matchesPrivateIpv6s,
  matchesPrivateIpv4s,
  matchesHostnames,
  hostValidation,
  portValidation,
} from '../schemas/addCamera'

const validateIp = ip => ({
  ipv4: yup
    .string()
    .matches(matchesIpv4s)
    .isValidSync(ip),
  ipv6: yup
    .string()
    .matches(matchesIpv6s)
    .isValidSync(ip),
  privateIpv4: yup
    .string()
    .matches(matchesPrivateIpv4s)
    .isValidSync(ip),
  privateIpv6: yup
    .string()
    .matches(matchesPrivateIpv6s)
    .isValidSync(ip),
  hostname: yup
    .string()
    .matches(matchesHostnames)
    .isValidSync(ip),
})

test('IP addresses matches', () => {
  expect(validateIp('217.87.33.146')).toMatchObject({
    ipv4: true,
    ipv6: false,
    privateIpv4: false,
    privateIpv6: false,
    hostname: false,
  })
  expect(validateIp('8.8.8.8')).toMatchObject({
    ipv4: true,
    ipv6: false,
    privateIpv4: false,
    privateIpv6: false,
    hostname: false,
  })
  expect(validateIp('192.168.178.32')).toMatchObject({
    ipv4: true,
    ipv6: false,
    privateIpv4: true,
    privateIpv6: false,
    hostname: false,
  })
  expect(validateIp('172.16.0.123')).toMatchObject({
    ipv4: true,
    ipv6: false,
    privateIpv4: true,
    privateIpv6: false,
    hostname: false,
  })
  expect(validateIp('2003:D3:4F23:2E00:4D29:3EA9:D1F2:9A6F')).toMatchObject({
    ipv4: false,
    ipv6: true,
    privateIpv4: false,
    privateIpv6: false,
    hostname: false,
  })
  expect(validateIp('::1')).toMatchObject({
    ipv4: false,
    ipv6: true,
    privateIpv4: false,
    privateIpv6: true,
    hostname: false,
  })
  expect(validateIp('rahrt.me')).toMatchObject({
    ipv4: false,
    ipv6: false,
    privateIpv4: false,
    privateIpv6: false,
    hostname: true,
  })
  expect(validateIp('sub.domain.tld')).toMatchObject({
    ipv4: false,
    ipv6: false,
    privateIpv4: false,
    privateIpv6: false,
    hostname: true,
  })
})

test('port Validation', () => {
  expect(portValidation.isValidSync(-1)).toBe(false)
  expect(portValidation.isValidSync(443)).toBe(true)
  expect(portValidation.isValidSync(65536)).toBe(false)
})

test('host Validation', () => {
  expect(hostValidation.isValidSync('217.87.33.146')).toBe(true)
  expect(hostValidation.isValidSync('192.168.178.32')).toBe(false)
  expect(
    hostValidation.isValidSync('2003:D3:4F23:2E00:4D29:3EA9:D1F2:9A6F'),
  ).toBe(true)
  expect(hostValidation.isValidSync('0:0000::1')).toBe(false)
})

test('addCameraSchema', () => {
  expect(
    addCameraSchema.isValidSync({
      name: 'Werkstatt',
      address: 'multi.dyndns.org',
      usr: 'admin',
      pwd: '123456',
      http: 80,
      rtsp: 1243,
    }),
  ).toBe(true)
})
