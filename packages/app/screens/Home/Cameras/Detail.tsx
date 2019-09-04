import React, { useEffect, useMemo } from 'react'
import { AsyncStorage, Button, View } from 'react-native'
import { NavigationActions, NavigationScreenComponent } from 'react-navigation'
import styled from 'styled-components/native'

import ListItem, { Seperator } from '../../../components/ListItem'
import Page from '../../../components/Page'
import VideoLoader from '../../../components/VideoLoader'
import { useGetCameraQuery } from '../../../generated/ApolloHooks'
import { StyledVideo } from './Main'

export const StyledScrollView = styled.ScrollView`
  height: 100%;
`

const DetailScreen: NavigationScreenComponent = ({ navigation }) => {
  const { data, error, loading } = useGetCameraQuery({
    variables: {
      id: navigation.getParam('cameraId'),
    },
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
    navigation.setParams({
      loaded: !loading,
    })
  }, [loading])
  return (
    <Page paddingTop={20} paddingBottom={0}>
      <StyledScrollView>
        {loading || !data ? (
          <VideoLoader height={220} />
        ) : (
          <StyledVideo
            source={{
              uri: data.camera.liveUrl,
            }}
            rate={1.0}
            volume={0}
            isMuted={true}
            resizeMode="cover"
            shouldPlay
            style={{ height: 220 }}
          />
        )}
        {[
          { key: 'name', name: 'Name' },
          { key: 'model', name: 'Modell' },
          { key: 'address', name: 'Adresse' },
          { key: 'usr', name: 'Kamera User' },
          { key: 'http', name: 'HTTP Port' },
          { key: 'rtsp', name: 'RTSP Port' },
        ].map(({ key, name }) => (
          <View key={key}>
            <ListItem
              title={`${name}:`}
              metaText={!loading && data && `${data.camera[key]}`}
            />
            <Seperator />
          </View>
        ))}
        <ListItem
          title="Events anzeigen"
          onPress={() => {
            navigation.navigate(
              'EventsMain',
              {
                filter: {
                  device: [
                    {
                      id: navigation.getParam('cameraId'),
                      name: navigation.getParam('cameraName'),
                    },
                  ],
                },
              },
              NavigationActions.navigate({ routeName: 'Events' }),
            )
          }}
          showArrow
        />
      </StyledScrollView>
    </Page>
  )
}

DetailScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('cameraName'),
  headerRight: (
    <Button
      title="Bearbeiten"
      onPress={() => {
        navigation.navigate('CameraAdd', {
          id: navigation.getParam('cameraId'),
          editMode: true,
        })
      }}
      disabled={!navigation.getParam('loaded')}
    />
  ),
})
export default DetailScreen
