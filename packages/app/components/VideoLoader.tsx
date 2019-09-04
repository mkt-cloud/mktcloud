import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

const Wrapper = styled.View<{ height: number }>`
  height: ${({ height }) => `${height}`}px;
  align-items: center;
  justify-content: center;
  background-color: black;
`

export default ({ height }) => (
  <Wrapper height={height}>
    <ActivityIndicator size="large" color="white" />
  </Wrapper>
)
