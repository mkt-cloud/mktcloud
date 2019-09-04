import { Button, Card, Text } from 'evergreen-ui'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'

import Center from '../components/Center'
import Page from '../components/Page'
import AddCamForm from '../containers/AddCamForm'
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
      me: { plan, cameras },
    } = this.props.loggedInUser
    return (
      <Page activePage="addCam" plan={plan}>
        <Card backgroundColor="white" paddingY="2em">
          {plan === 'FREE' && cameras.length >= 1 ? (
            <Center x y height="50vh" flexFlow="column">
              <Text>
                Mit dem FREE Plan können sie maximal eine Kamera nutzen.
                Upgraden Sie jetzt zum PREMIUM Plan für nur{' '}
                {(2.5).toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                })}
                !
              </Text>
              <Link href="/plan">
                <Button height={40} appearance="primary" marginTop="1em">
                  Zur Planübersicht
                </Button>
              </Link>
            </Center>
          ) : (
            <AddCamForm />
          )}
        </Card>
      </Page>
    )
  }
}
