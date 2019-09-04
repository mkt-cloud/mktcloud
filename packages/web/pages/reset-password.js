import React from 'react'
import { Card, Heading } from 'evergreen-ui'

import Center from '../components/Center'
import ResetPasswordForm from '../containers/ResetPasswordForm'

export default class CreateAccount extends React.Component {
  static async getInitialProps(context) {
    return { token: context.query.token, email: context.query.email }
  }

  render() {
    const { token, email } = this.props
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
          width="450px"
          backgroundColor="#fff"
        >
          <Heading marginBottom="1em">Passwort setzen</Heading>
          <ResetPasswordForm token={token} email={email} />
        </Card>
      </Center>
    )
  }
}
