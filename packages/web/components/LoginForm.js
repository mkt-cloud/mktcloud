import { schemas } from '@camcloud/common'
import { Alert, Button, Link as UILink, Pane, Paragraph } from 'evergreen-ui'
import { Field, Form, withFormik } from 'formik'
import propTypes from 'prop-types'
import { Toggle } from 'react-powerplug'

import ResetPasswordDialog from '../containers/ResetPasswordDialog'
import { TextInputField } from './formik-evergreen'
import Link from './Link'

const LoginForm = ({
  displayRegister,
  displayResetPassword,
  error,
  isSubmitting,
  values: { email: currentEmail },
  token,
}) => {
  return (
    <Form>
      {error && <Alert intent="danger" title={error} marginBottom="1em" />}
      {token && (
        <Alert
          intent="info"
          title={'Bitte anmelden um Account zu aktivieren'}
          marginBottom="1em"
        />
      )}
      <Field
        name="email"
        type="email"
        label="eMail"
        width="100%"
        component={TextInputField}
      />
      <Field
        name="password"
        type="password"
        label="Passwort"
        width="100%"
        component={TextInputField}
        hint={
          displayResetPassword && (
            <Paragraph>
              Password vergessen?{' '}
              <Toggle initial={false}>
                {({ on, toggle }) => (
                  <>
                    <UILink onClick={toggle} cursor="pointer">
                      Zurücksetzen
                    </UILink>
                    <ResetPasswordDialog
                      email={currentEmail}
                      blockInput={false}
                      isShown={on}
                      onClose={toggle}
                    />
                  </>
                )}
              </Toggle>
            </Paragraph>
          )
        }
      />
      <Pane width="100%" display="flex">
        <Pane flex={1}>
          {displayRegister && (
            <Paragraph>
              Neu hier?{' '}
              <Link prefetch href="/create-account">
                Registrieren
              </Link>
            </Paragraph>
          )}
        </Pane>
        <Button
          marginLeft="1em"
          appearance="primary"
          disabled={isSubmitting}
          type="submit"
        >
          Login
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
  mapPropsToValues: ({ email, password }) => ({
    email: email || '',
    password: password || '',
  }),
  validationSchema: schemas.loginSchema,
  handleSubmit: async (values, { props: { login, token }, setSubmitting }) => {
    await login({
      variables: { ...values, token },
    })
    setSubmitting(false)
  },
})(LoginForm)
