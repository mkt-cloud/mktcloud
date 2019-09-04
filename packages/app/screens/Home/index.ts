import { createBottomTabNavigator } from 'react-navigation'

import CamerasScreen from './Cameras'
import EventsScreen from './Events'
import SettingsScreen from './Settings'

const HomeNavigator = createBottomTabNavigator({
  Events: EventsScreen,
  Cameras: CamerasScreen,
  Settings: SettingsScreen,
})

export default HomeNavigator
