import { withApollo, graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import CamArea from '../components/CamArea'
import { Spinner } from 'evergreen-ui'
import Center from '../components/Center'

export const GET_CAM_AREA = gql`
  query getCamArea($id: ID!) {
    camera(_id: $id) {
      _id
      getMotionDetectConfig {
        result
        area0
        area1
        area2
        area3
        area4
        area5
        area6
        area7
        area8
        area9
      }
      takeSnap
    }
  }
`

const CamAreaContainer = ({ cameraArea, areaState = null, ...props }) => {
  return cameraArea &&
    cameraArea.camera &&
    cameraArea.camera.getMotionDetectConfig &&
    cameraArea.camera.getMotionDetectConfig.result === 0 ? (
    <CamArea
      area={
        areaState || [
          cameraArea.camera.getMotionDetectConfig.area0,
          cameraArea.camera.getMotionDetectConfig.area1,
          cameraArea.camera.getMotionDetectConfig.area2,
          cameraArea.camera.getMotionDetectConfig.area3,
          cameraArea.camera.getMotionDetectConfig.area4,
          cameraArea.camera.getMotionDetectConfig.area5,
          cameraArea.camera.getMotionDetectConfig.area6,
          cameraArea.camera.getMotionDetectConfig.area7,
          cameraArea.camera.getMotionDetectConfig.area8,
          cameraArea.camera.getMotionDetectConfig.area9,
        ]
      }
      snap={cameraArea.camera.takeSnap}
      {...props}
    />
  ) : (
    <Center>
      <Spinner />
    </Center>
  )
}

export default compose(
  graphql(GET_CAM_AREA, { name: 'cameraArea' }),
  withApollo,
)(CamAreaContainer)
