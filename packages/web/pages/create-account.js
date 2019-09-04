import { Card, Heading } from 'evergreen-ui'
import React from 'react'

import Center from '../components/Center'
import RegisterForm from '../containers/RegisterForm'
import checkLoggedIn from '../lib/checkLoggedIn'
import redirect from '../lib/redirect'

export default class CreateAccount extends React.Component {
  static async getInitialProps(context) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)

    if (loggedInUser.me) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, '/')
    }

    const query = context.query || {}

    return {
      email: query.email,
      firstName: query.firstName,
      lastName: query.lastName,
    }
  }

  render() {
    return (
      <Center
        x={false}
        y={true}
        paddingLeft="20%"
        height="100vh"
        width="100vw"
        backgroundColor="#34495e"
        backgroundImage="url('/static/bg.jpg')"
        backgroundSize="cover"
      >
        <Card
          elevation={4}
          paddingY="3em"
          paddingX="2em"
          width="450px"
          backgroundColor="#fff"
        >
          <Heading marginBottom="1em">Registrieren</Heading>
          <RegisterForm
            email={this.props.email}
            firstName={this.props.firstName}
            lastName={this.props.lastName}
          />
        </Card>
      </Center>
    )
  }
}
