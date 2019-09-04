import { Pane } from 'evergreen-ui'
import gql from 'graphql-tag'
import Link from 'next/link'
import { compose, graphql, withApollo } from 'react-apollo'

import NoCamFound from '../components/NoCamFound'
import Cam from './Cam'

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

const CamsContainer = ({ cameras: camerasData, ...props }) => {
  return camerasData && camerasData.cameras ? (
    camerasData.cameras.length ? (
      <Pane display="grid" gridTemplateColumns="repeat(2, 1fr)" gridGap="2em">
        {camerasData.cameras.map(x => (
          <Link
            key={x._id}
            as={`/cam/${x._id}`}
            href={{ pathname: '/cam', query: { id: x._id } }}
          >
            <a style={{ textDecoration: 'none' }}>
              <Cam
                id={x._id}
                cursor="pointer"
                height="310px" // nice little hack to keep ratio
                {...props}
              />
            </a>
          </Link>
        ))}
      </Pane>
    ) : (
      <NoCamFound />
    )
  ) : null
}

export default compose(
  graphql(GET_CAMS, { name: 'cameras' }),
  withApollo,
)(CamsContainer)
