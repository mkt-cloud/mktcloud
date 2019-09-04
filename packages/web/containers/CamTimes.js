import { Spinner } from 'evergreen-ui'
import gql from 'graphql-tag'
import { compose, graphql, withApollo } from 'react-apollo'

import CamTimes from '../components/CamTimes'
import Center from '../components/Center'

export const GET_CAM_TIMES = gql`
  query getCamTimes($id: ID!) {
    camera(_id: $id) {
      _id
      timeZone
      getMotionDetectConfig {
        result
        schedule0
        schedule1
        schedule2
        schedule3
        schedule4
        schedule5
        schedule6
      }
    }
  }
`

const shiftSchedule = (timeZone = 0) => (schedule = []) => {
  const shift = timeZone / 1800
  // wenn - dann von vorne nehmen und nach hinten packen
  // wenn + dann von hinten nach vorne packen
  const scheduleWorkingCopy = schedule.join('').split('')
  const removed =
    shift <= 0
      ? scheduleWorkingCopy.splice(0, Math.abs(shift))
      : scheduleWorkingCopy.splice(-1 * shift)

  const result =
    shift <= 0
      ? [...scheduleWorkingCopy, ...removed]
      : [...removed, ...scheduleWorkingCopy]

  return result.join('').match(/.{1,48}/g)
}

const CamTimesContainer = ({
  cameraTimes,
  schedulesState = null,
  ...props
}) => {
  if (
    cameraTimes &&
    cameraTimes.camera &&
    cameraTimes.camera.getMotionDetectConfig &&
    cameraTimes.camera.getMotionDetectConfig.result === 0
  ) {
    const schedules = schedulesState || [
      cameraTimes.camera.getMotionDetectConfig.schedule0,
      cameraTimes.camera.getMotionDetectConfig.schedule1,
      cameraTimes.camera.getMotionDetectConfig.schedule2,
      cameraTimes.camera.getMotionDetectConfig.schedule3,
      cameraTimes.camera.getMotionDetectConfig.schedule4,
      cameraTimes.camera.getMotionDetectConfig.schedule5,
      cameraTimes.camera.getMotionDetectConfig.schedule6,
    ]
    return (
      <CamTimes
        schedules={shiftSchedule(cameraTimes.camera.timeZone)(schedules)}
        unshiftSchedule={shiftSchedule(-1 * cameraTimes.camera.timeZone)}
        {...props}
      />
    )
  } else {
    return (
      <Center>
        <Spinner />
      </Center>
    )
  }
}

export default compose(
  graphql(GET_CAM_TIMES, { name: 'cameraTimes' }),
  withApollo,
)(CamTimesContainer)
