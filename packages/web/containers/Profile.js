import { withApollo, graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { GET_ME } from '../lib/checkLoggedIn'
import ProfileForm from '../components/ProfileForm'

export const UPDATE_ME = gql`
  mutation updateMe($firstName: String!, $lastName: String!, $email: String!) {
    updateMe(firstName: $firstName, lastName: $lastName, email: $email) {
      _id
      firstName
      lastName
      email
    }
  }
`

const ProfileContainer = ({ me: meData, updateMe, ...props }) => {
  return (
    meData &&
    meData.me && (
      <ProfileForm
        {...props}
        firstName={meData.me.firstName}
        lastName={meData.me.lastName}
        email={meData.me.email}
        updateMe={updateMe}
      />
    )
  )
}

export default compose(
  graphql(GET_ME, { name: 'me' }),
  graphql(UPDATE_ME, { name: 'updateMe' }),
  withApollo,
)(ProfileContainer)
