import { withApollo, graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import ResetPasswordDialog from '../components/ResetPasswordDialog'

export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!) {
    resetPassword(email: $email)
  }
`

export const GET_MY_EMAIL = gql`
  query getMe {
    me {
      _id
      firstName
      lastName
      email
      plan
    }
  }
`

const ResetPasswordDialogContainer = ({
  me: meData,
  resetPassword,
  ...props
}) => {
  const email = meData && meData.me && meData.me.email
  return (
    <ResetPasswordDialog
      email={email}
      blockInput={!!email}
      resetPassword={resetPassword}
      {...props}
    />
  )
}

export default compose(
  graphql(GET_MY_EMAIL, { name: 'me' }),
  graphql(RESET_PASSWORD, { name: 'resetPassword' }),
  withApollo,
)(ResetPasswordDialogContainer)
