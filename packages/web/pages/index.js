import PropTypes from 'prop-types'
import React from 'react'

import Page from '../components/Page'
import AllEvents from '../containers/AllEvents'
import BigPlayer from '../containers/BigPlayer'
import checkLoggedIn from '../lib/checkLoggedIn'
import redirect from '../lib/redirect'

export default class Index extends React.Component {
  static propTypes = {
    loggedInUser: PropTypes.any,
  }

  static async getInitialProps(context) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)

    if (!loggedInUser.me) {
      // If not signed in, send them somewhere more useful
      redirect(context, '/signin')
    }

    return { loggedInUser }
  }

  render() {
    const {
      me: { plan },
    } = this.props.loggedInUser
    return (
      <Page activePage="dashboard" plan={plan}>
        <BigPlayer />
        <AllEvents marginTop="2em" />
      </Page>
    )
  }
}
