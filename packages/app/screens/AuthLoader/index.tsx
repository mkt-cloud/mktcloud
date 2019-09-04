import { useApolloClient } from '@apollo/react-hooks'
import React, { useEffect } from 'react'
import { ActivityIndicator, AsyncStorage } from 'react-native'
import { NavigationScreenComponent } from 'react-navigation'

import Center from '../../components/Center'
import useAsyncEffect from '../../hooks/useAsyncEffect'

const AuthLoaderScreen: NavigationScreenComponent = ({ navigation }) => {
  const apolloClient = useApolloClient()
  useAsyncEffect(async () => {
    const value = await AsyncStorage.getItem('JWT')
    if (value !== null) {
      // We have data!!
      navigation.navigate('Home')
    } else {
      apolloClient.clearStore()
      navigation.navigate('Auth')
    }
  }, [])

  return (
    <Center>
      <ActivityIndicator size="large" />
    </Center>
  )
}

export default AuthLoaderScreen
