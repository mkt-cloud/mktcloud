import { Video } from 'expo-av'
import React, { useEffect } from 'react'
import { AsyncStorage, RefreshControl } from 'react-native'
import { NavigationActions, NavigationScreenComponent, ScrollView } from 'react-navigation'
import styled from 'styled-components/native'

import Header from '../../../components/Header'
import Page from '../../../components/Page'
import VideoLoader from '../../../components/VideoLoader'
import { useAllCamerasLiveUrlQuery, useAllCamerasQuery } from '../../../generated/ApolloHooks'
import { EmptyText } from '../Events/Main'

const Camera = styled.TouchableOpacity`
  overflow: hidden;
  border-radius: 20px;
  margin-bottom: 20px;
`

const CameraDescription = styled.View`
  z-index: 1;
  margin-top: -20px;
  border-radius: 20px;
  padding: 10px 20px;
  background-color: #3660fe;
  align-items: center;
`

export const StyledVideo = styled(Video)`
  background-color: black;
`

const CameraDescriptionTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`

const CameraDescriptionMeta = styled.Text`
  color: white;
`

const CamerasScreen: NavigationScreenComponent = ({ navigation }) => {
  const { data, error, loading, refetch } = useAllCamerasQuery()
  const liveUrl = useAllCamerasLiveUrlQuery()
  if (error || liveUrl.error) {
    AsyncStorage.clear(() => {
      navigation.navigate(
        'AuthLoader',
        {},
        NavigationActions.navigate({ routeName: 'AuthLoader' }),
      )
    })
  }
  return (
    <Page paddingBottom={80}>
      <Header
        title="Kameras"
        email={!loading && data && data.me.email}
        onPress={async () => {
          navigation.navigate('Settings')
        }}
        onAdd={() => {
          navigation.navigate('CameraAdd')
        }}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              refetch()
            }}
          />
        }
      >
        {!loading && data && data.me.cameras.length === 0 && (
          <EmptyText>Noch keine Kameras hinzugefügt</EmptyText>
        )}
        {!loading &&
          data &&
          data.me.cameras.map(camera => (
            <Camera
              key={camera._id}
              onPress={() => {
                navigation.navigate('CameraDetail', {
                  cameraId: camera._id,
                  cameraName: camera.name,
                })
              }}
            >
              {liveUrl.loading ? (
                <VideoLoader height={220} />
              ) : (
                <StyledVideo
                  source={{
                    uri: liveUrl.data.me.cameras.find(x => x._id === camera._id)
                      ? liveUrl.data.me.cameras.find(x => x._id === camera._id)
                          .liveUrl
                      : '',
                  }}
                  rate={1.0}
                  volume={0}
                  isMuted={true}
                  resizeMode="cover"
                  shouldPlay
                  style={{ height: 220 }}
                />
              )}
              <CameraDescription>
                <CameraDescriptionTitle>{camera.name}</CameraDescriptionTitle>
                <CameraDescriptionMeta>{camera.model}</CameraDescriptionMeta>
              </CameraDescription>
            </Camera>
          ))}
      </ScrollView>
    </Page>
  )
}

CamerasScreen.navigationOptions = {
  header: null,
}

export default CamerasScreen
