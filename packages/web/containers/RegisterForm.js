import { Mutation, withApollo } from 'react-apollo'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import cookie from 'cookie'
import redirect from '../lib/redirect'
import RegisterForm from '../components/RegisterForm'

const CREATE_USER = gql`
  mutation Register(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      _id
    }
    login(email: $email, password: $password) {
      status
      token
    }
  }
`

const RegisterFormContainer = ({ client, ...props }) => {
  return (
    <Mutation
      mutation={CREATE_USER}
      errorPolicy="all"
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
    >
      {(register, { error }) => {
        const { graphQLErrors } = error || {}
        return (
          <RegisterForm
            register={register}
            error={
              graphQLErrors &&
              graphQLErrors.length &&
              graphQLErrors.find(
                error => error.message !== 'email already exists',
              ) &&
              'Es konnte kein User erstellt werden'
            }
            {...props}
          />
        )
      }}
    </Mutation>
  )
}

RegisterFormContainer.propTypes = {
  client: PropTypes.any,
}

export default withApollo(RegisterFormContainer)
