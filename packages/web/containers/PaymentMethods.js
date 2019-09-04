import { Query, withApollo } from 'react-apollo'
import PaymentMethods from '../components/PaymentMethods'
import gql from 'graphql-tag'

const GET_MY_CLIENT_TOKEN = gql`
  query getMe {
    me {
      _id
      clientToken
    }
  }
`

const MyProfileContainer = ({ ...props }) => {
  return (
    <Query query={GET_MY_CLIENT_TOKEN}>
      {({ data }) =>
        data && data.me && data.me.clientToken ? (
          <PaymentMethods clientToken={data.me.clientToken} {...props} />
        ) : null
      }
    </Query>
  )
}

export default withApollo(MyProfileContainer)
