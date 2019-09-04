import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import Icon from './Icon'

const Event = styled.View`
  padding: 12px 10px;
  flex: 1;
`

const EventWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: 10px;
`

const EventTitle = styled.Text`
  font-size: 15px;
`

const MetaText = styled.Text`
  color: #8f8e93;
`

export default ({
  onPress = null,
  showArrow = false,
  metaText = null,
  title,
}: {
  onPress?: () => void
  showArrow?: boolean
  metaText?: string
  title: string
}) => (
  <TouchableOpacity onPress={onPress} disabled={!onPress}>
    <EventWrapper>
      <Event>
        <EventTitle>{title}</EventTitle>
        {metaText && <MetaText>{metaText}</MetaText>}
      </Event>
      {showArrow && <Icon name="arrow-forward" color="#8f8e93" />}
    </EventWrapper>
  </TouchableOpacity>
)

export const Seperator = styled.View`
  height: 1px;
  width: 100%;
  background-color: #ccc;
`
