import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-boost'
import React from 'react'
import { AsyncStorage } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import AuthScreen from './screens/Auth'
import AuthLoaderScreen from './screens/AuthLoader'
import HomeScreen from './screens/Home'

console.disableYellowBox = true

const client = new ApolloClient({
  uri: 'https://backend.mktcloud.ml',
  request: async operation => {
    const token = await AsyncStorage.getItem('JWT')
    operation.setContext({
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    })
  },
})

const AppNavigator = createSwitchNavigator(
  {
    Home: HomeScreen,
    Auth: AuthScreen,
    AuthLoader: AuthLoaderScreen,
  },
  {
    initialRouteName: 'AuthLoader',
  },
)

const AppNavigatorContainer = createAppContainer(AppNavigator)

export default () => (
  <ApolloProvider client={client}>
    <AppNavigatorContainer />
  </ApolloProvider>
)
