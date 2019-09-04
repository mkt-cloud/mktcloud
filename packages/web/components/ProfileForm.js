import propTypes from 'prop-types'
import { Button, Alert, Pane, Heading, toaster } from 'evergreen-ui'
import { Form, withFormik } from 'formik'
import { Toggle } from 'react-powerplug'
import { schemas } from '@camcloud/common'

import ProfileFields from './ProfileFields'
import ResetPasswordDialog from '../containers/ResetPasswordDialog'

const ProfileForm = ({ error, isSubmitting, dirty }) => {
  return (
    <Form>
      <Heading marginTop="1em" marginBottom="2em">
        Einstellungen
      </Heading>
      {error && <Alert intent="danger" title={error} marginBottom="1em" />}
      <ProfileFields />
      <Pane width="100%" display="flex" paddingBottom="1em">
        <Toggle initial={false}>
          {({ on, toggle }) => (
            <>
              <Button onClick={toggle} type="button">
                Password zurücksetzen
              </Button>
              <ResetPasswordDialog onClose={toggle} isShown={on} />
            </>
          )}
        </Toggle>
        <Pane flex={1} />
        <Button
          marginLeft="1em"
          appearance="primary"
          disabled={isSubmitting || !dirty}
          type="submit"
        >
          Speichern
        </Button>
      </Pane>
    </Form>
  )
}

ProfileForm.propTypes = {
  error: propTypes.any,
  isSubmitting: propTypes.bool,
}

export default withFormik({
  mapPropsToValues: ({ email, firstName, lastName }) => ({
    firstName: firstName || '',
    lastName: lastName || '',
    email: email || '',
  }),
  validationSchema: schemas.profileSchema,
  enableReinitialize: true,
  handleSubmit: async (
    values,
    { props: { updateMe }, setSubmitting, setErrors },
  ) => {
    try {
      await updateMe({
        variables: values,
      })
      toaster.success('Profil aktualisiert')
    } catch (e) {
      const { graphQLErrors = [] } = e || {}
      if (
        graphQLErrors.find(error => error.message === 'email already exists')
      ) {
        setErrors({
          email: 'Ein Benutzer mit dieser eMail existiert bereits',
        })
      }
    }

    setSubmitting(false)
  },
})(ProfileForm)
