import gql from 'graphql-tag'
import { useState } from 'react'
import { compose, graphql, withApollo } from 'react-apollo'

import EventTable, { PAGE_SIZE } from '../components/EventTable'
import { GET_CAMS } from './Cams'

const GET_ALL_EVENTS = gql`
  query allEvents(
    $offset: Int!
    $type: [String]
    $fromDate: Int
    $toDate: Int
    $device: [String]
  ) {
    me {
      _id
      events(
        options: {
          skip: $offset
          limit: 20
          type: $type
          fromDate: $fromDate
          toDate: $toDate
          device: $device
        }
      ) {
        total
        data {
          _id
          date
          type
          cam {
            _id
            name
          }
        }
      }
    }
  }
`

const typeMap = {
  all: [],
  alarm: [
    'CAMERA_HEALTH_CHECK_OFFLINE',
    'CAMERA_HEALTH_CHECK_ONLINE',
    'CAMERA_ALARM',
  ],
  cam_events: [
    'CAMERA_ADDED',
    'CAMERA_UPDATED',
    'CAMERA_REMOVED',
    'CAMERA_SHOT',
  ],
  account_events: [
    'USER_LOGIN',
    'USER_ADDED',
    'USER_REMOVED',
    'USER_RESET_PASSWORD_MAIL',
    'USER_RESET_PASSWORD',
    'SWITCH_PLAN_FREE_PREMIUM',
    'SWITCH_PLAN_PREMIUM_FREE',
    'SWITCH_PLAN_PREMIUM_PREMIUM',
  ],
}

export const optionsToParameters = options => ({
  ...options,
  type: typeMap[options.type],
  device: options.camera === 'all' ? [] : [options.camera],
})

const AllEventsContainer = ({ me: meData, cameras: camerasData, ...props }) => {
  const [options, setOptions] = useState({ type: 'all', camera: 'all' })
  const [page, setPage] = useState(0)
  return (
    <EventTable
      {...props}
      events={meData && meData.me ? [...meData.me.events.data] : []}
      totalEvents={meData && meData.me ? meData.me.events.total : 0}
      fetchPage={page => {
        setPage(page)
        meData.refetch({
          offset: page * PAGE_SIZE,
        })
      }}
      page={page}
      options={options}
      cameras={(camerasData.cameras || []).map(x => ({
        value: x._id,
        label: x.name,
      }))}
      refetch={newOptions => {
        setOptions(newOptions)
        setPage(0)
        meData.refetch({
          offset: 0,
          ...optionsToParameters(newOptions),
        })
      }}
    />
  )
}

export default compose(
  graphql(GET_ALL_EVENTS, {
    name: 'me',
    options: {
      variables: {
        offset: 0,
      },
      pollInterval: 5000,
    },
  }),
  graphql(GET_CAMS, { name: 'cameras' }),
  withApollo,
)(AllEventsContainer)
