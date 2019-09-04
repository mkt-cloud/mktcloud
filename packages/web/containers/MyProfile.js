import { Query, withApollo } from 'react-apollo'
import UserProfile from '../components/UserProfile'
import { GET_ME } from '../lib/checkLoggedIn'

const MyProfileContainer = ({ ...props }) => {
  return (
    <Query query={GET_ME}>
      {({ data }) => <UserProfile profile={data.me} {...props} />}
    </Query>
  )
}

export default withApollo(MyProfileContainer)
