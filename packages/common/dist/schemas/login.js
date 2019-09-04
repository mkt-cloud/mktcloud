"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.passwordValidation = exports.emailValidation = exports.passwordErrors = exports.emailErrors = void 0;

var yup = _interopRequireWildcard(require("yup"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var emailErrors = {
  required: 'Eine eMail muss angegeben werden',
  format: 'Die eMail ist ungültig'
};
exports.emailErrors = emailErrors;
var passwordErrors = {
  required: 'Ein Password muss angegeben werden',
  min: 'Ein Password muss mindestens 8 Zeichen haben',
  max: 'Ein Password kann maximal 128 Zeichen haben',
  number: 'Ein Password muss mindestens eine Zahl enthalten'
};
exports.passwordErrors = passwordErrors;
var emailValidation = yup.string().required(emailErrors.required).email(emailErrors.format);
exports.emailValidation = emailValidation;
var passwordValidation = yup.string().required(passwordErrors.required).min(8, passwordErrors.min).max(128, passwordErrors.max).matches(/(?=.*[0-9])/g, passwordErrors.number);
exports.passwordValidation = passwordValidation;

var _default = yup.object().required().shape({
  email: emailValidation,
  password: passwordValidation
});

exports.default = _default;