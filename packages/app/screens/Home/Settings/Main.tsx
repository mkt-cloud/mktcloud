import React from 'react'
import { AsyncStorage, Button, View } from 'react-native'
import { NavigationActions, NavigationScreenComponent } from 'react-navigation'
import styled from 'styled-components/native'

import Header from '../../../components/Header'
import { H2 } from '../../../components/Heading'
import ListItem, { Seperator } from '../../../components/ListItem'
import Page from '../../../components/Page'
import { useMeQuery } from '../../../generated/ApolloHooks'
import { StyledScrollView } from '../Cameras/Detail'

const planToString = (plan: string) =>
  plan === 'FREE' ? 'Kostenloser Plan' : 'Premium Plan'
const countArray = (arr: any[]) => `${arr.length}`

const Flex = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const ButtonWrapper = styled.View`
  margin-top: 40px;
`

const SettingsScreen: NavigationScreenComponent = ({ navigation }) => {
  const { data, error, loading } = useMeQuery()
  if (error) {
    AsyncStorage.clear(() => {
      navigation.navigate(
        'AuthLoader',
        {},
        NavigationActions.navigate({ routeName: 'AuthLoader' }),
      )
    })
  }
  return (
    <Page paddingBottom={0}>
      <Header title="Einstellungen" email={!loading && data && data.me.email} />
      <StyledScrollView>
        <Flex>
          <H2>Profil</H2>
          <Button
            title="Bearbeiten"
            onPress={() => {
              navigation.navigate('SettingsEdit')
            }}
            disabled={loading || !data}
          />
        </Flex>
        {[
          { key: 'firstName', name: 'Vorname' },
          { key: 'lastName', name: 'Nachname' },
          { key: 'email', name: 'eMail Adresse' },
          { key: 'plan', name: 'Plan', mod: planToString },
          { key: 'cameras', name: 'Anzahl Kameras', mod: countArray },
        ].map(({ key, name, mod }, i, array) => (
          <View key={key}>
            <ListItem
              title={name}
              metaText={
                !loading && data && (mod ? mod(data.me[key]) : data.me[key])
              }
            />
            {array.length - 1 !== i && <Seperator />}
          </View>
        ))}
        <ButtonWrapper>
          <Button
            color="red"
            title="Ausloggen"
            onPress={() => {
              AsyncStorage.clear(() => {
                navigation.navigate(
                  'AuthLoader',
                  {},
                  NavigationActions.navigate({ routeName: 'AuthLoader' }),
                )
              })
            }}
          />
        </ButtonWrapper>
      </StyledScrollView>
    </Page>
  )
}

SettingsScreen.navigationOptions = {
  header: null,
}

export default SettingsScreen
