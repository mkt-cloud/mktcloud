import cookie from 'cookie'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import { Mutation, withApollo } from 'react-apollo'

import LoginForm from '../components/LoginForm'
import redirect from '../lib/redirect'

const SIGN_IN = gql`
  mutation Signin($email: String!, $password: String!, $token: String) {
    login(email: $email, password: $password, token: $token) {
      status
      token
    }
  }
`

const LoginFormContainer = ({ client, ...props }) => {
  return (
    <Mutation
      mutation={SIGN_IN}
      onCompleted={data => {
        // Store the token in cookie
        document.cookie = cookie.serialize('token', data.login.token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
        })
        // Force a reload of all the current queries now that the user is
        // logged in
        client.cache.reset().then(() => {
          redirect({}, '/')
        })
      }}
      onError={error => {
        // If you want to send error to external service?
        console.log(error)
      }}
    >
      {(login, { data }) => (
        <LoginForm
          login={login}
          error={
            data &&
            data.login.status === 'ERROR' &&
            'Es wurde kein User mit dieser eMail Password Kombination gefunden'
          }
          {...props}
        />
      )}
    </Mutation>
  )
}

LoginFormContainer.propTypes = {
  client: PropTypes.any,
}

export default withApollo(LoginFormContainer)
