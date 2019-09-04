import { format } from 'date-fns'
import React from 'react'
import { Text, TextProps } from 'react-native'

export const formatDate = (date: string) =>
  format(new Date(parseInt(date, 10)), 'DD.MM.YYYY HH:mm')

export default ({ date, ...props }: { date: string } & TextProps) => (
  <Text {...props}>{formatDate(date)}</Text>
)
