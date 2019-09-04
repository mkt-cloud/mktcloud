import propTypes from 'prop-types'
import { SelectMenu, FormField } from 'evergreen-ui'

const FormikSelectMenuField = ({
  field: { value, onChange, name, ...restField },
  form,
  label,
  labelProps,
  isRequired,
  description,
  hint,
  title,
  onSelect,
  ...props
}) => {
  const error = form.touched[name] && form.errors[name]
  return (
    <FormField
      label={label || title}
      labelProps={labelProps}
      validationMessage={error}
      isRequired={isRequired}
      description={description}
      hint={hint}
    >
      <SelectMenu
        selected={value}
        onSelect={x => {
          onChange({ target: { name, value: x.value } })
          return onSelect(x)
        }}
        name={name}
        hasTitle={false}
        title={title}
        {...restField}
        {...props}
      />
    </FormField>
  )
}

FormikSelectMenuField.propTypes = {
  children: propTypes.node.isRequired,
  onSelect: propTypes.func,
}
FormikSelectMenuField.defaultProps = {
  onSelect: () => {},
}

export default FormikSelectMenuField
