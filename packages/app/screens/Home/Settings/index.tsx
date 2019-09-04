import React from 'react'
import { createStackNavigator } from 'react-navigation'

import Icon from '../../../components/Icon'
import EditScreen from './Edit'
import MainScreen from './Main'

const SettingsStackNav = createStackNavigator(
  {
    SettingsMain: MainScreen,
    SettingsEdit: EditScreen,
  },
  {
    initialRouteName: 'SettingsMain',
  },
)

SettingsStackNav.navigationOptions = {
  tabBarLabel: 'Einstellungen',
  tabBarIcon: ({ focused }) => <Icon focused={focused} name={'settings'} />,
}

export default SettingsStackNav
