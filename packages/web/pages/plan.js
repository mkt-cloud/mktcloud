import { Heading, Pane } from 'evergreen-ui'
import PropTypes from 'prop-types'
import React from 'react'

import Center from '../components/Center'
import Page from '../components/Page'
import { SettingsWrapper } from '../components/SettingsWrapper'
import Abo from '../containers/Abo'
import checkLoggedIn from '../lib/checkLoggedIn'
import redirect from '../lib/redirect'

export default class PlanPage extends React.Component {
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
    return (
      <Page>
        <Center>
          <SettingsWrapper active="abo">
            <Pane>
              <Heading marginTop="1em" marginBottom="2em">
                Abonnement
              </Heading>
              <Abo />
            </Pane>
          </SettingsWrapper>
        </Center>
      </Page>
    )
  }
}
