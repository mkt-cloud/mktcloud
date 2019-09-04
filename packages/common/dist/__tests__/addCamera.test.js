"use strict";

var yup = _interopRequireWildcard(require("yup"));

var _addCamera = _interopRequireWildcard(require("../schemas/addCamera"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var validateIp = function validateIp(ip) {
  return {
    ipv4: yup.string().matches(_addCamera.matchesIpv4s).isValidSync(ip),
    ipv6: yup.string().matches(_addCamera.matchesIpv6s).isValidSync(ip),
    privateIpv4: yup.string().matches(_addCamera.matchesPrivateIpv4s).isValidSync(ip),
    privateIpv6: yup.string().matches(_addCamera.matchesPrivateIpv6s).isValidSync(ip),
    hostname: yup.string().matches(_addCamera.matchesHostnames).isValidSync(ip)
  };
};

test('IP addresses matches', function () {
  expect(validateIp('217.87.33.146')).toMatchObject({
    ipv4: true,
    ipv6: false,
    privateIpv4: false,
    privateIpv6: false,
    hostname: false
  });
  expect(validateIp('8.8.8.8')).toMatchObject({
    ipv4: true,
    ipv6: false,
    privateIpv4: false,
    privateIpv6: false,
    hostname: false
  });
  expect(validateIp('192.168.178.32')).toMatchObject({
    ipv4: true,
    ipv6: false,
    privateIpv4: true,
    privateIpv6: false,
    hostname: false
  });
  expect(validateIp('172.16.0.123')).toMatchObject({
    ipv4: true,
    ipv6: false,
    privateIpv4: true,
    privateIpv6: false,
    hostname: false
  });
  expect(validateIp('2003:D3:4F23:2E00:4D29:3EA9:D1F2:9A6F')).toMatchObject({
    ipv4: false,
    ipv6: true,
    privateIpv4: false,
    privateIpv6: false,
    hostname: false
  });
  expect(validateIp('::1')).toMatchObject({
    ipv4: false,
    ipv6: true,
    privateIpv4: false,
    privateIpv6: true,
    hostname: false
  });
  expect(validateIp('rahrt.me')).toMatchObject({
    ipv4: false,
    ipv6: false,
    privateIpv4: false,
    privateIpv6: false,
    hostname: true
  });
  expect(validateIp('sub.domain.tld')).toMatchObject({
    ipv4: false,
    ipv6: false,
    privateIpv4: false,
    privateIpv6: false,
    hostname: true
  });
});
test('port Validation', function () {
  expect(_addCamera.portValidation.isValidSync(-1)).toBe(false);
  expect(_addCamera.portValidation.isValidSync(443)).toBe(true);
  expect(_addCamera.portValidation.isValidSync(65536)).toBe(false);
});
test('host Validation', function () {
  expect(_addCamera.hostValidation.isValidSync('217.87.33.146')).toBe(true);
  expect(_addCamera.hostValidation.isValidSync('192.168.178.32')).toBe(false);
  expect(_addCamera.hostValidation.isValidSync('2003:D3:4F23:2E00:4D29:3EA9:D1F2:9A6F')).toBe(true);
  expect(_addCamera.hostValidation.isValidSync('0:0000::1')).toBe(false);
});
test('addCameraSchema', function () {
  expect(_addCamera.default.isValidSync({
    name: 'Werkstatt',
    address: 'multi.dyndns.org',
    usr: 'admin',
    pwd: '123456',
    http: 80,
    rtsp: 1243
  })).toBe(true);
});