import * as yup from 'yup'

export const emailErrors = {
  required: 'Eine eMail muss angegeben werden',
  format: 'Die eMail ist ungültig',
}
export const passwordErrors = {
  required: 'Ein Password muss angegeben werden',
  min: 'Ein Password muss mindestens 8 Zeichen haben',
  max: 'Ein Password kann maximal 128 Zeichen haben',
  number: 'Ein Password muss mindestens eine Zahl enthalten',
}

export const emailValidation = yup
  .string()
  .required(emailErrors.required)
  .email(emailErrors.format)
export const passwordValidation = yup
  .string()
  .required(passwordErrors.required)
  .min(8, passwordErrors.min)
  .max(128, passwordErrors.max)
  .matches(/(?=.*[0-9])/g, passwordErrors.number)

export default yup
  .object()
  .required()
  .shape({
    email: emailValidation,
    password: passwordValidation,
  })
