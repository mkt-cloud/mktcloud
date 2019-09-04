import propTypes from 'prop-types'
import { Button, Alert, Pane } from 'evergreen-ui'
import { TextInputField } from './formik-evergreen'
import { Form, Field, withFormik } from 'formik'

const LoginForm = ({ error, isSubmitting }) => {
  return (
    <Form>
      {error && <Alert intent="danger" title={error} marginBottom="1em" />}
      <Field
        name="email"
        type="email"
        label="eMail"
        width="100%"
        disabled
        component={TextInputField}
      />
      <Field
        name="newPassword"
        type="password"
        label="Neues Passwort"
        width="100%"
        component={TextInputField}
      />
      <Pane width="100%" display="flex">
        <Pane flex={1} />
        <Button
          marginLeft="1em"
          appearance="primary"
          disabled={isSubmitting}
          type="submit"
        >
          Passwort setzen
        </Button>
      </Pane>
    </Form>
  )
}

LoginForm.propTypes = {
  error: propTypes.any,
  isSubmitting: propTypes.bool,
  displayRegister: propTypes.bool,
  displayResetPassword: propTypes.bool,
}
LoginForm.defaultProps = {
  displayRegister: true,
  displayResetPassword: true,
}

export default withFormik({
  mapPropsToValues: ({ email }) => ({
    email,
    newPassword: '',
  }),
  handleSubmit: async (
    values,
    { props: { resetPassword, token }, setSubmitting },
  ) => {
    await resetPassword({
      variables: { ...values, token },
    })
    setSubmitting(false)
  },
})(LoginForm)
