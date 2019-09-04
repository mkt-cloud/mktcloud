import { Mutation, withApollo } from 'react-apollo'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import redirect from '../lib/redirect'
import ResetPasswordForm from '../components/ResetPasswordForm'
import { toaster } from 'evergreen-ui'

const SET_PASSWORD = gql`
  mutation Signin($token: String!, $newPassword: String!) {
    setPassword(token: $token, newPassword: $newPassword) {
      _id
    }
  }
`

const ResetPasswordFormContainer = ({ token, ...props }) => {
  return (
    <Mutation
      mutation={SET_PASSWORD}
      onCompleted={() => {
        redirect({}, '/signin')
        toaster.success(
          'Passwort wurde gesetzt. Bitte loggen Sie sich mit Ihren neuen Daten ein!',
        )
      }}
      onError={error => {
        // If you want to send error to external service?
        toaster.danger(
          'Das Passwort konnte nicht geändert werden. Bitte lassen Sie sich die eMail erneut zuschicken.',
        )
        console.log(error)
      }}
    >
      {resetPassword => (
        <ResetPasswordForm
          token={token}
          resetPassword={resetPassword}
          {...props}
        />
      )}
    </Mutation>
  )
}

ResetPasswordFormContainer.propTypes = {
  client: PropTypes.any,
  token: PropTypes.string.isRequired,
}

export default withApollo(ResetPasswordFormContainer)
