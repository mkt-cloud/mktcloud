import React, { useState } from 'react'
import { ActivityIndicator, AsyncStorage, TouchableOpacity } from 'react-native'
import { FlatList, NavigationActions, NavigationScreenComponent } from 'react-navigation'
import styled from 'styled-components/native'

import { formatDate } from '../../../components/Date'
import Header from '../../../components/Header'
import Icon from '../../../components/Icon'
import ListItem, { Seperator } from '../../../components/ListItem'
import Page from '../../../components/Page'
import { AllEventsQueryVariables, EventOptions, useAllEventsQuery } from '../../../generated/ApolloHooks'

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export type FilterOptions = Overwrite<
  EventOptions,
  {
    device?: [
      {
        id: string
        name: string
      },
    ]
    type?: string
  }
>

export const eventTypeToString = (eventType: string) => {
  switch (eventType) {
    case 'USER_LOGIN':
      return 'Erfolgreicher Benutzer Login'
    case 'USER_ADDED':
      return 'Benutzer erstellt'
    case 'USER_REMOVED':
      return 'Benutzer gelöscht'
    case 'USER_RESET_PASSWORD_MAIL':
      return 'eMail zum Passwort zurücksetzen verschickt'
    case 'USER_RESET_PASSWORD':
      return 'Passwort wurde geändert'
    case 'CAMERA_ADDED':
      return 'Kamera hinzugefügt'
    case 'CAMERA_UPDATED':
      return 'Kamera bearbeitet'
    case 'CAMERA_REMOVED':
      return 'Kamera entfernt'
    case 'CAMERA_HEALTH_CHECK_OFFLINE':
      return 'Kamera offline - Healthcheck fehlgeschlagen!'
    case 'CAMERA_HEALTH_CHECK_ONLINE':
      return 'Kamera wieder online - Healthcheck erfolgreich!'
    case 'CAMERA_SHOT':
      return 'Foto erstellt'
    case 'SWITCH_PLAN_FREE_PREMIUM':
      return 'Premium Abo abgeschlossen'
    case 'SWITCH_PLAN_PREMIUM_FREE':
      return 'Premium Abo gekündigt'
    case 'SWITCH_PLAN_PREMIUM_PREMIUM':
      return 'Zahlungsmethode gewechselt'
    case 'CAMERA_ALARM':
    default:
      return 'Bewegung erkannt'
  }
}

const typeMap = {
  all: [],
  alarm: [
    'CAMERA_HEALTH_CHECK_OFFLINE',
    'CAMERA_HEALTH_CHECK_ONLINE',
    'CAMERA_ALARM',
  ],
  cam_events: [
    'CAMERA_ADDED',
    'CAMERA_UPDATED',
    'CAMERA_REMOVED',
    'CAMERA_SHOT',
  ],
  account_events: [
    'USER_LOGIN',
    'USER_ADDED',
    'USER_REMOVED',
    'USER_RESET_PASSWORD_MAIL',
    'USER_RESET_PASSWORD',
    'SWITCH_PLAN_FREE_PREMIUM',
    'SWITCH_PLAN_PREMIUM_FREE',
    'SWITCH_PLAN_PREMIUM_PREMIUM',
  ],
}

const ScrollView = styled.ScrollView`
  width: 100%;
  height: 40px;
`
const Filter = styled.View`
  height: 30px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #3660fe;
  border-radius: 15px;
  min-width: 30px;
  padding: 5px 12px;
  margin-right: 5px;
`
const FilterText = styled.Text`
  color: white;
  margin-right: 5px;
`
export const EmptyText = styled.Text`
  text-align: center;
  font-weight: 500;
  padding: 20px 5px;
`

const getFilterText = (filterKey: string, filterValue) => {
  switch (filterKey) {
    case 'device':
      return Array.isArray(filterValue) && filterValue[0].name
    case 'type': {
      switch (filterValue) {
        case 'alarm':
          return 'Nur Alarme'
        case 'account_events':
          return 'Nur Account Events'
        case 'cam_events':
          return 'Nur Kamera Events'
        case 'all':
        default:
          return ''
      }
    }
    default:
      return ''
  }
}
const generateFilterComponents = (filter: FilterOptions, navigation) => {
  return Object.keys(filter)
    .map(filterKey => {
      const filterValue = filter[filterKey]
      if (filterKey === 'type' && filterValue === 'all') return false
      return (
        <TouchableOpacity
          key={filterKey}
          onPress={() => {
            const filter = navigation.getParam('filter')
            delete filter[filterKey]
            navigation.setParams({
              filter,
            })
          }}
        >
          <Filter>
            <FilterText>{getFilterText(filterKey, filterValue)}</FilterText>
            <Icon name="close-circle-outline" color="white" size={18} />
          </Filter>
        </TouchableOpacity>
      )
    })
    .filter(x => !!x)
}

const generateQuery = (filter: FilterOptions) => {
  const variables: Overwrite<
    AllEventsQueryVariables,
    { skip?: number; limit?: number }
  > = {}
  if (filter.device && Array.isArray(filter.device)) {
    variables.device = filter.device.map(x => x.id)
  }
  if (filter.type) {
    variables.type = typeMap[filter.type]
  }
  return variables
}

const PAGE_SIZE = 20

const EventsScreen: NavigationScreenComponent<{
  filter: FilterOptions
}> = ({ navigation }) => {
  const [page, setPage] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const filter = navigation.getParam('filter') || {}
  const { data, error, loading, fetchMore, refetch } = useAllEventsQuery({
    variables: { ...generateQuery(filter), limit: PAGE_SIZE, skip: 0 },
  })
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
    <Page>
      <Header
        title="Events"
        email={!loading && data && data.me.email}
        onPress={async () => {
          navigation.navigate('Settings')
        }}
      />

      <ScrollView horizontal>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EventFilter', {
              filter,
            })
          }}
        >
          <Filter>
            <Icon name="funnel" color="white" size={22} />
          </Filter>
        </TouchableOpacity>
        {generateFilterComponents(filter, navigation)}
      </ScrollView>

      {!loading && data && (
        <FlatList
          ItemSeparatorComponent={() => <Seperator />}
          data={data.me.events.data}
          refreshing={refreshing}
          ListFooterComponent={() =>
            data.me.events.total > page * PAGE_SIZE && (
              <ActivityIndicator size="large" />
            )
          }
          ListEmptyComponent={() => (
            <EmptyText>Noch keine Events aufgezeichnet</EmptyText>
          )}
          onRefresh={async () => {
            setRefreshing(true)
            await refetch({ limit: PAGE_SIZE, skip: 0 })
            setPage(0)
            setRefreshing(false)
          }}
          renderItem={({ item }) => (
            <ListItem
              title={eventTypeToString(item.type)}
              metaText={`${formatDate(item.date)}${
                item.cam ? `, ${item.cam.name}` : ''
              }`}
              showArrow={['CAMERA_SHOT', 'CAMERA_ALARM'].includes(item.type)}
              onPress={() => {
                if (['CAMERA_SHOT', 'CAMERA_ALARM'].includes(item.type)) {
                  navigation.navigate('EventDetail', {
                    eventName: eventTypeToString(item.type),
                    eventId: item._id,
                  })
                }
              }}
            />
          )}
          keyExtractor={({ _id }) => _id}
          onEndReached={() => {
            if (data.me.events.total > page * PAGE_SIZE) {
              const increasedPage = page + 1
              setPage(increasedPage)
              fetchMore({
                variables: { skip: increasedPage * PAGE_SIZE },
                updateQuery: (prev, { fetchMoreResult }) => ({
                  ...fetchMoreResult,
                  me: {
                    ...fetchMoreResult.me,
                    events: {
                      ...fetchMoreResult.me.events,
                      data: [
                        ...prev.me.events.data,
                        ...fetchMoreResult.me.events.data,
                      ],
                    },
                  },
                }),
              })
            }
          }}
          onEndReachedThreshold={0.5}
          initialNumToRender={PAGE_SIZE}
        />
      )}
    </Page>
  )
}

EventsScreen.navigationOptions = {
  header: null,
}

export default EventsScreen
