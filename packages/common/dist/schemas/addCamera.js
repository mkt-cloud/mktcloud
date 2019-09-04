"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.portValidation = exports.hostValidation = exports.matchesHostnames = exports.matchesPrivateIpv6s = exports.matchesIpv6s = exports.matchesPrivateIpv4s = exports.matchesIpv4s = exports.portErrors = exports.addressErrors = exports.nameErrors = void 0;

var yup = _interopRequireWildcard(require("yup"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var nameErrors = {
  required: 'Ein Name muss angegeben werden',
  min: 'Der Name muss mindestens 3 Zeichen haben',
  max: 'Der Name kann maximal 128 Zeichen haben'
};
exports.nameErrors = nameErrors;
var addressErrors = {
  required: 'Eine Adresse muss angegeben werden',
  url: 'Die Adresse ist keine gültige URL',
  whitespace: 'Die Adresse darf kein Leerzeichen enthalten',
  local: 'Nutzen sie nur öffentliche Adressen. Lokale Adressen sind nicht aus dem Internet zu erreichen und unzulässig'
};
exports.addressErrors = addressErrors;
var portErrors = {
  required: 'Ein Port muss angegeben werden',
  min: 'Ein Port muss positiv sein',
  max: 'Ein Port kann maximal 65535 lauten'
};
exports.portErrors = portErrors;
var matchesIpv4s = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
exports.matchesIpv4s = matchesIpv4s;
var matchesPrivateIpv4s = /^(^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.).*$/;
exports.matchesPrivateIpv4s = matchesPrivateIpv4s;
var matchesIpv6s = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
exports.matchesIpv6s = matchesIpv6s;
var matchesPrivateIpv6s = /^[0:]+1$/;
exports.matchesPrivateIpv6s = matchesPrivateIpv6s;
var matchesHostnames = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
exports.matchesHostnames = matchesHostnames;
var hostValidation = yup.string().required(addressErrors.required).trim().test('is-valid-host', addressErrors.url, function (host) {
  var isIpv4 = yup.string().matches(matchesIpv4s).isValidSync(host);
  var isIpv6 = yup.string().matches(matchesIpv6s).isValidSync(host);
  var isHostname = yup.string().matches(matchesHostnames).isValidSync(host);
  return isIpv4 || isIpv6 || isHostname;
}).test('is-public-host', addressErrors.local, function (host) {
  var isLocalIpv4 = yup.string().matches(matchesPrivateIpv4s).isValidSync(host);
  var isLocalIpv6 = yup.string().matches(matchesPrivateIpv6s).isValidSync(host);
  return !(isLocalIpv4 || isLocalIpv6);
});
exports.hostValidation = hostValidation;
var portValidation = yup.number().min(0, portErrors.min).max(65535, portErrors.max);
exports.portValidation = portValidation;

var _default = yup.object().required().shape({
  name: yup.string().required(nameErrors.required).min(3, nameErrors.min).max(128, nameErrors.max),
  address: hostValidation,
  usr: yup.string().ensure(),
  pwd: yup.string().ensure(),
  http: portValidation.required(addressErrors.required),
  rtsp: portValidation
});

exports.default = _default;