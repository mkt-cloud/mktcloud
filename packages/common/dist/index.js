"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.regexs = exports.validations = exports.schemas = void 0;

var _schemas = require("./schemas");

var schemas = {
  loginSchema: _schemas.loginSchema,
  registerSchema: _schemas.registerSchema,
  profileSchema: _schemas.profileSchema,
  addCameraSchema: _schemas.addCameraSchema
};
exports.schemas = schemas;
var validations = {
  hostValidation: _schemas.hostValidation,
  portValidation: _schemas.portValidation,
  emailValidation: _schemas.emailValidation
};
exports.validations = validations;
var regexs = {
  ipv6Regex: _schemas.ipv6Regex,
  ipv4Regex: _schemas.ipv4Regex,
  privateIpv4Regex: _schemas.privateIpv4Regex,
  privateIpv6Regex: _schemas.privateIpv6Regex,
  hostnameRegex: _schemas.hostnameRegex
};
exports.regexs = regexs;
var _default = {
  regexs: regexs,
  schemas: schemas,
  validations: validations
};
exports.default = _default;