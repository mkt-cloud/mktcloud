import md5 from 'md5'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import Heading from './Heading'
import Icon from './Icon'

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`
const ProfileImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-top: 15px;
`

const Flex = styled.View`
  flex-direction: row;
`

const StyledIcon = styled(Icon)`
  padding: 12px;
  margin-right: 8px;
`

export default ({ title, email = '', onPress = () => {}, onAdd = null }) => (
  <Header>
    <Heading>{title}</Heading>
    <Flex>
      {onAdd && (
        <TouchableOpacity onPress={onAdd}>
          <StyledIcon name="add" size={42} focused />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onPress}>
        <ProfileImage
          source={{
            uri: `https://www.gravatar.com/avatar/${md5(email)}?s=120&d=mp`,
          }}
        />
      </TouchableOpacity>
    </Flex>
  </Header>
)
