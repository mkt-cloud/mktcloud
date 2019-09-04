import React from 'react'
import { Button, Picker } from 'react-native'
import { NavigationScreenComponent } from 'react-navigation'

import { H2 } from '../../../components/Heading'
import Page from '../../../components/Page'
import { useMeQuery } from '../../../generated/ApolloHooks'
import { ButtonWrapper } from '../Cameras/Add'
import { StyledScrollView } from '../Cameras/Detail'
import { FilterOptions } from './Main'

const EventFilterScreen: NavigationScreenComponent<{
  filter: FilterOptions
  onSave?: () => void
  readyForSave?: boolean
}> = ({ navigation }) => {
  const filter = navigation.getParam('filter') || {}
  const { data, error, loading } = useMeQuery()
  return (
    <Page paddingTop={20} paddingBottom={0}>
      <StyledScrollView>
        <H2>Kamera</H2>
        <Picker
          selectedValue={filter.device && filter.device[0].id}
          style={{ height: 200 }}
          onValueChange={itemValue => {
            const camO = data.me.cameras.find(x => x._id === itemValue) || {
              name: '',
            }
            const filter = navigation.getParam('filter')
            if (!itemValue) {
              delete filter.device
              navigation.setParams({
                filter: {
                  ...filter,
                },
                readyForSave: true,
              })
            } else {
              navigation.setParams({
                filter: {
                  ...filter,
                  device: [
                    {
                      id: itemValue,
                      name: camO.name,
                    },
                  ],
                },
                readyForSave: true,
              })
            }
          }}
          enabled={!loading}
        >
          <Picker.Item label="Alle" />
          {!loading &&
            data &&
            data.me.cameras.map(cam => (
              <Picker.Item key={cam._id} label={cam.name} value={cam._id} />
            ))}
        </Picker>
        <H2>Event Typ</H2>
        <Picker
          selectedValue={filter.type}
          style={{ height: 200 }}
          onValueChange={itemValue => {
            navigation.setParams({
              filter: {
                ...filter,
                type: itemValue,
              },
              readyForSave: true,
            })
          }}
          enabled={!loading}
        >
          <Picker.Item label="Alle" value="all" />
          <Picker.Item label="Alarm" value="alarm" />
          <Picker.Item label="Account" value="account_events" />
          <Picker.Item label="Kamera" value="cam_events" />
        </Picker>
        <ButtonWrapper>
          <Button
            title="Filter zurücksetzen"
            color="red"
            onPress={() => {
              navigation.navigate('EventsMain', { filter: {} })
            }}
          />
        </ButtonWrapper>
      </StyledScrollView>
    </Page>
  )
}

EventFilterScreen.navigationOptions = ({ navigation }) => ({
  title: 'Events filtern',
  headerRight: (
    <Button
      title="Übernehmen"
      onPress={() => {
        navigation.navigate('EventsMain', {
          filter: navigation.getParam('filter'),
        })
      }}
      disabled={!navigation.getParam('readyForSave')}
    />
  ),
})

export default EventFilterScreen
