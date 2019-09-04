import { withApollo, graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import BigPlayer from '../components/BigPlayer'
import NoCamFound from '../components/NoCamFound'

export const GET_CAMS = gql`
  query getCams {
    cameras {
      _id
      name
      address
      model
    }
  }
`

const BigPlayerContainer = ({ cameras: camerasData, ...props }) => {
  return camerasData && camerasData.cameras ? (
    camerasData.cameras.length ? (
      <BigPlayer cameras={camerasData.cameras} {...props} />
    ) : (
      <NoCamFound />
    )
  ) : null
}

export default compose(
  graphql(GET_CAMS, { name: 'cameras' }),
  withApollo,
)(BigPlayerContainer)
