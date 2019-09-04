import { withApollo, graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { IconButton, Tooltip } from 'evergreen-ui'
import Grid from '../components/Grid'
import Center from '../components/Center'

export const UPDATE_CAM_PTZ = gql`
  mutation updateCamPtz($id: ID!, $ptzMove: PtzMove!) {
    updateCamera(_id: $id, ptzMove: $ptzMove) {
      _id
    }
  }
`

const CamPtzContainer = ({ updateCamPtz, show = false, id }) => {
  return (
    <Center
      x
      maxHeight={show ? '500px' : '0px'}
      overflow="hidden"
      transition="all 300ms ease-in-out"
    >
      <Grid
        gridTemplateColumns="repeat(3, 1fr)"
        gridTemplateRows="repeat(3, 1fr)"
        width="140px"
        gridGap="10px"
        marginY="1em"
      >
        <Center y x>
          <IconButton
            onClick={() =>
              updateCamPtz({ variables: { id, ptzMove: 'UPLEFT' } })
            }
            icon="arrow-top-left"
            height={40}
          />
        </Center>
        <Center y x>
          <IconButton
            onClick={() => updateCamPtz({ variables: { id, ptzMove: 'UP' } })}
            icon="arrow-up"
            height={40}
          />
        </Center>
        <Center y x>
          <IconButton
            onClick={() =>
              updateCamPtz({ variables: { id, ptzMove: 'UPRIGHT' } })
            }
            icon="arrow-top-right"
            height={40}
          />
        </Center>
        <Center y x>
          <IconButton
            onClick={() => updateCamPtz({ variables: { id, ptzMove: 'LEFT' } })}
            icon="arrow-left"
            height={40}
          />
        </Center>
        <Center y x>
          <Tooltip content="Reset Position">
            <IconButton
              onClick={() =>
                updateCamPtz({ variables: { id, ptzMove: 'RESET' } })
              }
              icon="circle"
              height={40}
            />
          </Tooltip>
        </Center>
        <Center y x>
          <IconButton
            onClick={() =>
              updateCamPtz({ variables: { id, ptzMove: 'RIGHT' } })
            }
            icon="arrow-right"
            height={40}
          />
        </Center>
        <Center y x>
          <IconButton
            onClick={() =>
              updateCamPtz({ variables: { id, ptzMove: 'DOWNLEFT' } })
            }
            icon="arrow-bottom-left"
            height={40}
          />
        </Center>
        <Center y x>
          <IconButton
            onClick={() => updateCamPtz({ variables: { id, ptzMove: 'DOWN' } })}
            icon="arrow-down"
            height={40}
          />
        </Center>
        <Center y x>
          <IconButton
            onClick={() =>
              updateCamPtz({ variables: { id, ptzMove: 'DOWNRIGHT' } })
            }
            icon="arrow-bottom-right"
            height={40}
          />
        </Center>
      </Grid>
    </Center>
  )
}

export default compose(
  graphql(UPDATE_CAM_PTZ, { name: 'updateCamPtz' }),
  withApollo,
)(CamPtzContainer)
