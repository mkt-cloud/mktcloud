import { TextInputField } from 'evergreen-ui'

export default function FormikTextInputField({ field, form, ...props }) {
  const error = form.touched[field.name] && form.errors[field.name]
  return <TextInputField {...field} validationMessage={error} {...props} />
}
