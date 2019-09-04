import * as yup from 'yup'

import loginSchema from './login'

export const firstNameErrors = {
  required: 'Ein Vorname muss angegeben werden',
  min: 'Der Vorname muss mindestens 3 Zeichen haben',
  max: 'Der Vorname kann maximal 128 Zeichen haben',
}
export const lastNameErrors = {
  required: 'Ein Nachname muss angegeben werden',
  min: 'Der Nachname muss mindestens 3 Zeichen haben',
  max: 'Der Nachname kann maximal 128 Zeichen haben',
}

export default loginSchema.shape({
  firstName: yup
    .string()
    .required(firstNameErrors.required)
    .min(3, firstNameErrors.min)
    .max(128, firstNameErrors.max),
  lastName: yup
    .string()
    .required(lastNameErrors.required)
    .min(3, lastNameErrors.min)
    .max(128, lastNameErrors.max),
})
