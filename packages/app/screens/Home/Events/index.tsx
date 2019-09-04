import React from 'react'
import { createStackNavigator } from 'react-navigation'

import Icon from '../../../components/Icon'
import DetailScreen from './EventDetail'
import FilterScreen from './Filter'
import MainScreen from './Main'

const EventsStackNav = createStackNavigator(
  {
    EventsMain: MainScreen,
    EventDetail: DetailScreen,
    EventFilter: FilterScreen,
  },
  {
    initialRouteName: 'EventsMain',
  },
)

EventsStackNav.navigationOptions = {
  tabBarLabel: 'Events',
  tabBarIcon: ({ focused }) => <Icon focused={focused} name={'recording'} />,
}

export default EventsStackNav
