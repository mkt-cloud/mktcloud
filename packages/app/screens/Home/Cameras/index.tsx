import React from 'react'
import { createStackNavigator } from 'react-navigation'

import Icon from '../../../components/Icon'
import AddScreen from './Add'
import DetailScreen from './Detail'
import MainScreen from './Main'

const CameraStackNav = createStackNavigator(
  {
    CamerasMain: MainScreen,
    CameraAdd: AddScreen,
    CameraDetail: DetailScreen,
  },
  {
    initialRouteName: 'CamerasMain',
    defaultNavigationOptions: {
      headerBackTitle: 'Zurück',
    },
  },
)

CameraStackNav.navigationOptions = {
  tabBarLabel: 'Kameras',
  tabBarIcon: ({ focused }) => <Icon focused={focused} name={'videocam'} />,
}

export default CameraStackNav
