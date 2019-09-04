"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.lastNameErrors = exports.firstNameErrors = void 0;

var yup = _interopRequireWildcard(require("yup"));

var _login = _interopRequireDefault(require("./login"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var firstNameErrors = {
  required: 'Ein Vorname muss angegeben werden',
  min: 'Der Vorname muss mindestens 3 Zeichen haben',
  max: 'Der Vorname kann maximal 128 Zeichen haben'
};
exports.firstNameErrors = firstNameErrors;
var lastNameErrors = {
  required: 'Ein Nachname muss angegeben werden',
  min: 'Der Nachname muss mindestens 3 Zeichen haben',
  max: 'Der Nachname kann maximal 128 Zeichen haben'
};
exports.lastNameErrors = lastNameErrors;

var _default = _login.default.shape({
  firstName: yup.string().required(firstNameErrors.required).min(3, firstNameErrors.min).max(128, firstNameErrors.max),
  lastName: yup.string().required(lastNameErrors.required).min(3, lastNameErrors.min).max(128, lastNameErrors.max)
});

exports.default = _default;