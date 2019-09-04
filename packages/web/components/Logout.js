import { ApolloConsumer } from 'react-apollo'
import { Pane } from 'evergreen-ui'
import cookie from 'cookie'

import redirect from '../lib/redirect'

const Logout = props => (
  <ApolloConsumer>
    {client => <Pane onClick={signout(client)} {...props} />}
  </ApolloConsumer>
)

const signout = apolloClient => () => {
  document.cookie = cookie.serialize('token', '', {
    maxAge: -1, // Expire the cookie immediately
  })

  // Force a reload of all the current queries now that the user is
  // logged out, so we don't accidentally leave any state around.
  apolloClient.cache.reset().then(() =>
    // Redirect to a more useful page when signed out
    redirect({}, '/signin'),
  )
}

export default Logout
