import gql from 'graphql-tag'
import { useState } from 'react'
import { compose, graphql, withApollo } from 'react-apollo'

import EventTable from '../components/EventTable'
import { optionsToParameters } from './AllEvents'

const GET_CAM_EVENTS = gql`
  query camEvents(
    $id: ID!
    $offset: Int!
    $type: [String]
    $fromDate: Int
    $toDate: Int
    $device: [String]
  ) {
    camera(_id: $id) {
      _id
      events(
        options: {
          skip: $offset
          limit: 10
          type: $type
          fromDate: $fromDate
          toDate: $toDate
          device: $device
        }
      ) {
        total
        data {
          _id
          type
          date
        }
      }
    }
  }
`

const CamEventsContainer = ({ camera: cameraData, ...props }) => {
  const [options, setOptions] = useState({ type: 'all', camera: 'all' })
  const [page, setPage] = useState(0)
  return (
    <EventTable
      {...props}
      events={
        cameraData && cameraData.camera
          ? [...cameraData.camera.events.data]
          : []
      }
      totalEvents={
        cameraData && cameraData.camera ? cameraData.camera.events.total : 0
      }
      page={page}
      fetchPage={page => {
        setPage(page)
        cameraData.refetch({
          offset: page * 10,
        })
      }}
      options={options}
      pageSize="10"
      refetch={newOptions => {
        setOptions(newOptions)
        setPage(0)
        cameraData.refetch({
          offset: 0,
          ...optionsToParameters(newOptions),
        })
      }}
    />
  )
}

export default compose(
  graphql(GET_CAM_EVENTS, {
    name: 'camera',
    options: ({ id }) => ({
      variables: { id, offset: 0 },
      pollInterval: 5000,
    }),
  }),
  withApollo,
)(CamEventsContainer)
