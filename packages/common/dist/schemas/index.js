"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.hostnameRegex = exports.privateIpv6Regex = exports.privateIpv4Regex = exports.ipv4Regex = exports.ipv6Regex = exports.emailValidation = exports.portValidation = exports.hostValidation = exports.addCameraSchema = exports.profileSchema = exports.registerSchema = exports.loginSchema = void 0;

var _login = _interopRequireWildcard(require("./login"));

var _profile = _interopRequireDefault(require("./profile"));

var _register = _interopRequireDefault(require("./register"));

var _addCamera = _interopRequireWildcard(require("./addCamera"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var loginSchema = _login.default;
exports.loginSchema = loginSchema;
var registerSchema = _register.default;
exports.registerSchema = registerSchema;
var profileSchema = _profile.default;
exports.profileSchema = profileSchema;
var addCameraSchema = _addCamera.default;
exports.addCameraSchema = addCameraSchema;
var hostValidation = _addCamera.hostValidation;
exports.hostValidation = hostValidation;
var portValidation = _addCamera.portValidation;
exports.portValidation = portValidation;
var emailValidation = _login.emailValidation;
exports.emailValidation = emailValidation;
var ipv6Regex = _addCamera.matchesIpv6s;
exports.ipv6Regex = ipv6Regex;
var ipv4Regex = _addCamera.matchesIpv4s;
exports.ipv4Regex = ipv4Regex;
var privateIpv4Regex = _addCamera.matchesPrivateIpv4s;
exports.privateIpv4Regex = privateIpv4Regex;
var privateIpv6Regex = _addCamera.matchesPrivateIpv6s;
exports.privateIpv6Regex = privateIpv6Regex;
var hostnameRegex = _addCamera.matchesHostnames;
exports.hostnameRegex = hostnameRegex;
var _default = {
  loginSchema: loginSchema,
  profileSchema: profileSchema,
  registerSchema: registerSchema,
  addCameraSchema: addCameraSchema,
  hostValidation: hostValidation,
  portValidation: portValidation,
  emailValidation: emailValidation,
  ipv6Regex: ipv6Regex,
  ipv4Regex: ipv4Regex,
  privateIpv4Regex: privateIpv4Regex,
  privateIpv6Regex: privateIpv6Regex,
  hostnameRegex: hostnameRegex
};
exports.default = _default;