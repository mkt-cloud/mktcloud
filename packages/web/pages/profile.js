import PropTypes from 'prop-types'
import React from 'react'

import Center from '../components/Center'
import Page from '../components/Page'
import Profile from '../containers/Profile'
import checkLoggedIn from '../lib/checkLoggedIn'
import redirect from '../lib/redirect'
import { SettingsWrapper } from './../components/SettingsWrapper'

export default class ProfilePage extends React.Component {
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
      <Page plan={plan}>
        <Center>
          <SettingsWrapper active="settings">
            <Profile />
          </SettingsWrapper>
        </Center>
      </Page>
    )
  }
}
