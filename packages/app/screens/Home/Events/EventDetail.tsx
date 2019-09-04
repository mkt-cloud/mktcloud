import React, { useEffect, useMemo } from 'react'
import { AsyncStorage, Share, TouchableOpacity, View } from 'react-native'
import { NavigationActions, NavigationScreenComponent } from 'react-navigation'
import styled from 'styled-components/native'

import Date from '../../../components/Date'
import Heading from '../../../components/Heading'
import Icon from '../../../components/Icon'
import Page from '../../../components/Page'
import VideoLoader from '../../../components/VideoLoader'
import { useGetEventQuery } from '../../../generated/ApolloHooks'
import { StyledVideo } from '../Cameras/Main'
import { eventTypeToString } from './Main'

const StyledImage = styled.Image`
  height: 250px;
  background-color: black;
`
const IconWrapper = styled.View`
  margin-right: 10px;
`
const StyledDate = styled(Date)`
  margin-top: -25px;
  margin-bottom: 25px;
  color: #8f8e93;
`

const EventDetailScreen: NavigationScreenComponent<{
  eventId: string
  eventName: string
  uri: string
}> = ({ navigation }) => {
  const { data, error, loading } = useGetEventQuery({
    variables: { id: navigation.getParam('eventId') },
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
  useEffect(() => {
    if (!loading && data) {
      navigation.setParams({ uri: data.event.download })
    }
  }, [loading])
  return (
    <Page paddingTop={20}>
      {loading && <VideoLoader height={250} />}
      {!loading && (
        <View>
          <Heading>{eventTypeToString(data.event.type)}</Heading>
          <StyledDate date={data.event.date} />
          {data.event.type === 'CAMERA_SHOT' ? (
            <StyledImage
              resizeMode="contain"
              source={{ uri: data.event.download }}
            />
          ) : (
            <StyledVideo
              source={{
                uri: data.event.download,
              }}
              rate={1.0}
              volume={0}
              isMuted={true}
              resizeMode="cover"
              shouldPlay
              useNativeControls
              style={{ height: 220 }}
            ></StyledVideo>
          )}
        </View>
      )}
    </Page>
  )
}

EventDetailScreen.navigationOptions = ({ navigation }) => ({
  title: `${navigation.getParam('eventName')}`,
  headerRight: (
    <TouchableOpacity
      onPress={() => {
        Share.share({
          url: navigation.getParam('uri'),
          message: navigation.getParam('uri'),
          title: 'Event teilen',
        })
      }}
    >
      <IconWrapper>
        <Icon name="share" focused />
      </IconWrapper>
    </TouchableOpacity>
  ),
})

export default EventDetailScreen
