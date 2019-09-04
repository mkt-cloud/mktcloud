import { Card, Heading } from 'evergreen-ui'
import React from 'react'

import Center from '../components/Center'
import LoginForm from '../containers/LoginForm'
import checkLoggedIn from '../lib/checkLoggedIn'
import redirect from '../lib/redirect'

export default class Signin extends React.Component {
  static async getInitialProps(context) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)

    if (loggedInUser.me) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, '/')
    }

    console.log({ token: context.query.token, email: context.query.email })
    return { token: context.query.token, email: context.query.email }
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
        {/* SigninBox handles all login logic. */}
        <Card
          elevation={4}
          paddingY="3em"
          paddingX="2em"
          width="350px"
          backgroundColor="#fff"
        >
          <Heading marginBottom="1em">Login</Heading>
          <LoginForm token={this.props.token} email={this.props.email} />
        </Card>
      </Center>
    )
  }
}
