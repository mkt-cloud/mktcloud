import { Dialog } from 'evergreen-ui'
import gql from 'graphql-tag'
import { compose, graphql, withApollo } from 'react-apollo'
import { State } from 'react-powerplug'

import CamTimes from './CamTimes2'

export const UPDATE_CAM_TIMES = gql`
  mutation updateCamTimes(
    $id: ID!
    $setMotionDetectConfig: MotionDetectConfigInput!
  ) {
    updateCamera(_id: $id, setMotionDetectConfig: $setMotionDetectConfig) {
      _id
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

const CamTimesDialogContainer = ({
  updateCamTimes,
  show = false,
  toggle,
  id,
  ...props
}) => {
  return (
    <State initial={{ loading: false }}>
      {({ state, setState }) => (
        <Dialog
          isShown={show}
          isConfirmLoading={state.loading}
          title="Kamera Zeitplan (Motiondetection)"
          onCloseComplete={toggle}
          confirmLabel={state.loading ? 'Lädt...' : 'Speichern'}
          cancelLabel="Abbrechen"
          onConfirm={async () => {
            setState({ loading: true })
            await updateCamTimes({
              variables: {
                id,
                setMotionDetectConfig: {
                  schedule0: state.schedules[0],
                  schedule1: state.schedules[1],
                  schedule2: state.schedules[2],
                  schedule3: state.schedules[3],
                  schedule4: state.schedules[4],
                  schedule5: state.schedules[5],
                  schedule6: state.schedules[6],
                },
              },
            })
            toggle()
            setTimeout(() => setState({ loading: false }), 300)
          }}
          isConfirmDisabled={!state.schedules}
        >
          <CamTimes
            id={id}
            onChange={schedules => {
              setState({ schedules })
            }}
            schedulesState={state.schedules}
            {...props}
          />
        </Dialog>
      )}
    </State>
  )
}

export default compose(
  graphql(UPDATE_CAM_TIMES, { name: 'updateCamTimes' }),
  withApollo,
)(CamTimesDialogContainer)
