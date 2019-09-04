import gql from 'graphql-tag'
import { compose, graphql, withApollo } from 'react-apollo'

import Abo from '../components/Abo'
import { GET_ME } from '../lib/checkLoggedIn'

const UPDATE_PLAN = gql`
  mutation switchPlan($plan: Plan!, $nonce: String) {
    switchPlan(plan: $plan, nonce: $nonce) {
      _id
      plan
    }
  }
`

const AboContainer = ({ me: meData, updatePlan, ...props }) => {
  return (
    meData &&
    meData.me && (
      <Abo
        {...props}
        plan={meData.me.plan}
        updatePlan={updatePlan}
        cameraCount={meData.me.cameras.length}
      />
    )
  )
}

export default compose(
  graphql(GET_ME, { name: 'me' }),
  graphql(UPDATE_PLAN, { name: 'updatePlan' }),
  withApollo,
)(AboContainer)
