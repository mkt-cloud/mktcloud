import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Platform } from 'react-native'

export default function Icon({
  name,
  focused = false,
  color = null,
  size = 26,
  ...props
}) {
  return (
    <Ionicons
      name={Platform.OS === 'ios' ? `ios-${name}` : `md-${name}`}
      size={size}
      style={{ marginBottom: -3 }}
      color={color ? color : focused ? '#3660fe' : '#8f8e93'}
      {...props}
    />
  )
}
