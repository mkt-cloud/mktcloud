import propTypes from 'prop-types'
import { Button, Alert, Pane, Text } from 'evergreen-ui'
import { Form, Field, withFormik } from 'formik'
import { schemas } from '@camcloud/common'

import Link from './Link'
import { TextInputField } from './formik-evergreen'
import ProfileFields from './ProfileFields'

const RegisterForm = ({ displayLogin, error, isSubmitting }) => {
  return (
    <Form>
      {error && <Alert intent="danger" title={error} marginBottom="1em" />}
      <ProfileFields />
      <Field
        name="password"
        type="password"
        label="Passwort"
        width="100%"
        component={TextInputField}
      />
      <Pane width="100%" display="flex">
        <Pane flex={1}>
          {displayLogin && (
            <Text>
              Sie haben bereits einen Account?{' '}
              <Link prefetch href="/signin">
                Einloggen
              </Link>
            </Text>
          )}
        </Pane>
        <Button
          marginLeft="1em"
          appearance="primary"
          disabled={isSubmitting}
          type="submit"
        >
          Registrieren
        </Button>
      </Pane>
    </Form>
  )
}

RegisterForm.propTypes = {
  error: propTypes.any,
  isSubmitting: propTypes.bool,
  displayLogin: propTypes.bool,
}
RegisterForm.defaultProps = {
  displayLogin: true,
}

export default withFormik({
  mapPropsToValues: ({ email, password, firstName, lastName }) => ({
    firstName: firstName || '',
    lastName: lastName || '',
    email: email || '',
    password: password || '',
  }),
  validationSchema: schemas.registerSchema,
  handleSubmit: async (
    values,
    { props: { register }, setSubmitting, setErrors },
  ) => {
    try {
      await register({
        variables: values,
      })
    } catch (e) {
      const { graphQLErrors = [] } = e || {}
      if (
        graphQLErrors.find(error => error.message === 'email already exists')
      ) {
        setErrors({
          email: 'Ein Benutzer mit dieser eMail existiert bereits',
        })
      }
      setSubmitting(false)
    }
  },
})(RegisterForm)
