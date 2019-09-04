import { schemas } from '@camcloud/common'
import useFormal from '@kevinwolf/formal-native'
import React from 'react'
import { AsyncStorage, Button } from 'react-native'
import { NavigationScreenComponent } from 'react-navigation'
import styled from 'styled-components/native'

import Center from '../../components/Center'
import Heading from '../../components/Heading'
import { Field } from '../../components/TextInput'
import { useLoginMutation } from '../../generated/ApolloHooks'

const ButtonGroup = styled.View`
  margin-top: 10px;
`

const AuthScreen: NavigationScreenComponent<null, null, { email?: string }> = ({
  navigation,
  email = '',
}) => {
  const [loginMutation] = useLoginMutation()
  const loginFormal = useFormal(
    { email, password: '' },
    {
      schema: schemas.loginSchema,
      onSubmit: async ({ email, password }) => {
        try {
          const res = await loginMutation({
            variables: {
              email,
              password,
            },
          })
          if (!res) throw new Error('Connection Issue')
          const {
            data: { login },
            errors,
          } = res
          if (errors && errors.length > 0)
            throw new Error('Request Format Error')
          if (login.status === 'ERROR') throw new Error('Wrong Login Data')
          if (login.status === 'SUCCESS' && login.token) {
            await AsyncStorage.multiSet([['JWT', login.token], ['mail', email]])
            console.log(login.token)
            navigation.navigate('AuthLoader')
          }
        } catch {
          loginFormal.setErrors({ password: 'Falsche Login Daten' })
        }
      },
    },
  )
  return (
    <Center>
      <Heading center>MKTCloud</Heading>
      <Field
        {...loginFormal.getFieldProps('email')}
        label="eMail"
        autoCompleteType="email"
        keyboardType="email-address"
        autoCorrect={false}
        autoFocus
      />
      <Field
        {...loginFormal.getFieldProps('password')}
        secureTextEntry
        autoCompleteType="password"
        label="Password"
        autoCorrect={false}
        clearTextOnFocus
      />
      <ButtonGroup>
        <Button {...loginFormal.getSubmitButtonProps()} title="Login" />
      </ButtonGroup>
    </Center>
  )
}

export default AuthScreen
