import PropTypes from 'prop-types'
import React from 'react'

import Page from '../components/Page'
import Cams from '../containers/Cams'
import checkLoggedIn from '../lib/checkLoggedIn'
import redirect from '../lib/redirect'

export default class CamsPage extends React.Component {
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
      <Page activePage="cams" plan={plan}>
        <Cams />
      </Page>
    )
  }
}
