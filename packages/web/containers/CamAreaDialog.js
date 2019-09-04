import { withApollo, graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Dialog } from 'evergreen-ui'
import { State } from 'react-powerplug'
import CamArea from './CamArea'
import MotionDetectLegend from '../components/MotionDetectLegend'

export const UPDATE_CAM_AREA = gql`
  mutation updateCamArea(
    $id: ID!
    $setMotionDetectConfig: MotionDetectConfigInput!
  ) {
    updateCamera(_id: $id, setMotionDetectConfig: $setMotionDetectConfig) {
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
    }
  }
`

const CamAreaDialogContainer = ({
  updateCamArea,
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
          title="Kamera Bereich (Motiondetection)"
          onCloseComplete={toggle}
          confirmLabel={state.loading ? 'Lädt...' : 'Speichern'}
          cancelLabel="Abbrechen"
          onConfirm={async () => {
            setState({ loading: true })
            await updateCamArea({
              variables: {
                id,
                setMotionDetectConfig: {
                  area0: state.area[0],
                  area1: state.area[1],
                  area2: state.area[2],
                  area3: state.area[3],
                  area4: state.area[4],
                  area5: state.area[5],
                  area6: state.area[6],
                  area6: state.area[7],
                  area6: state.area[8],
                  area6: state.area[9],
                },
              },
            })
            toggle()
            setTimeout(() => setState({ loading: false }), 300)
          }}
          isConfirmDisabled={!state.area}
        >
          <CamArea
            id={id}
            onChange={area => {
              setState({ area })
            }}
            areaState={state.area}
            {...props}
          />
          <MotionDetectLegend />
        </Dialog>
      )}
    </State>
  )
}

export default compose(
  graphql(UPDATE_CAM_AREA, { name: 'updateCamArea' }),
  withApollo,
)(CamAreaDialogContainer)
