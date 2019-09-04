import * as yup from 'yup'
import registerSchema from './register'

export default registerSchema.shape({
  password: yup.string(), // dont expect password when updating
})
