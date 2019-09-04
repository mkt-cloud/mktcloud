import gql from 'graphql-tag'
import { compose, graphql, withApollo } from 'react-apollo'

import EventDialog from '../components/EventDialog'

const GET_EVENT = gql`
  query getEvent($id: ID!) {
    event(_id: $id) {
      _id
      date
      type
      download
    }
  }
`

const EventDialogContainer = ({ event: eventData, ...props }) => {
  const event = eventData && eventData.event
  return event ? <EventDialog event={event} {...props} /> : null
}

export default compose(
  graphql(GET_EVENT, {
    name: 'event',
    options: ({ id }) => ({
      variables: { id },
      ssr: false,
    }),
    skip: ({ id }) => !id,
  }),
  withApollo,
)(EventDialogContainer)
