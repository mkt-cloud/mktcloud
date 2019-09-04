import gql from 'graphql-tag'

export const GET_ME = gql`
  query getMe {
    me {
      _id
      firstName
      lastName
      email
      plan
      cameras {
        _id
        name
      }
    }
  }
`

export default apolloClient =>
  apolloClient
    .query({
      query: GET_ME,
    })
    .then(({ data }) => {
      return { loggedInUser: data }
    })
    .catch(() => {
      // Fail gracefully
      return { loggedInUser: {} }
    })
