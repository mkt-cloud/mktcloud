import { Heading } from 'evergreen-ui'
import gql from 'graphql-tag'
import { compose, graphql, withApollo } from 'react-apollo'

import Cam from '../components/Cam'
import Center from '../components/Center'
import supportedCams from '../data/supportedCams'

export const GET_CAM = gql`
  query getCam($id: ID!) {
    camera(_id: $id) {
      _id
      name
      address
      model
    }
  }
`

export const GET_CAM_LIVE_URL = gql`
  query getCamLiveUrl($id: ID!) {
    camera(_id: $id) {
      _id
      liveUrl
    }
  }
`

const CamsContainer = ({
  camera: cameraData,
  liveUrl: liveUrlData,
  ...props
}) => {
  return cameraData && cameraData.camera ? (
    <Cam
      key={cameraData.camera._id}
      title={cameraData.camera.name}
      model={cameraData.camera.model}
      canUsePtz={
        supportedCams.find(x => x.name === cameraData.camera.model).meta
          .ptz_supported === 1
      }
      url={liveUrlData && liveUrlData.camera && liveUrlData.camera.liveUrl}
      height="480px" // nice little hack to keep ratio
      {...props}
    />
  ) : (
    <Center>
      <Heading>Sie haben keine Berechtigungen für diese Kamera</Heading>
    </Center>
  )
}

export default compose(
  // as long as @defer isn't supported we need to make two requests
  graphql(GET_CAM_LIVE_URL, {
    name: 'liveUrl',
    options: ({ id }) => ({
      ssr: false,
      variables: { id },
    }),
  }),
  graphql(GET_CAM, {
    name: 'camera',
    options: ({ id }) => ({
      variables: { id },
    }),
  }),
  withApollo,
)(CamsContainer)
