import cookie from 'cookie'
import { toaster } from 'evergreen-ui'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import { Mutation, withApollo } from 'react-apollo'

import AddCamForm from '../components/AddCamForm'
import redirect from '../lib/redirect'
import { GET_CAMS } from './Cams'

const ADD_CAMERA = gql`
  mutation AddCam(
    $name: String!
    $model: String!
    $address: String!
    $http: Int!
    $rtsp: Int
    $usr: String!
    $pwd: String!
  ) {
    addCamera(
      name: $name
      model: $model
      address: $address
      http: $http
      rtsp: $rtsp
      usr: $usr
      pwd: $pwd
    ) {
      _id
      name
      address
      model
    }
    refreshToken {
      token
    }
  }
`
const AddCamFormContainer = props => {
  return (
    <Mutation
      onCompleted={({ refreshToken }) => {
        if (refreshToken && refreshToken.token) {
          document.cookie = cookie.serialize('token', refreshToken.token)
        }
        toaster.success('Kamera wurde erfolgreich hinzugefügt!')
        redirect({}, '/cams')
      }}
      mutation={ADD_CAMERA}
      update={(cache, { data: { addCamera } }) => {
        try {
          const { cameras } = cache.readQuery({ query: GET_CAMS })
          cache.writeQuery({
            query: GET_CAMS,
            data: { cameras: [...cameras, addCamera] },
          })
        } catch (e) {
          //GET_CAMS wasn't fetched yet, ignore update
        }
      }}
    >
      {(addCamera, { error }) => {
        const { graphQLErrors } = error || {}
        console.log(graphQLErrors)
        return (
          <AddCamForm
            executeMutation={addCamera}
            error={
              graphQLErrors &&
              graphQLErrors.length &&
              graphQLErrors.find(
                error =>
                  !['InvalidHost', 'InvalidCreds'].includes(error.message),
              ) &&
              (graphQLErrors.find(error => error.message === 'LimitExceeded')
                ? 'Sie nutzen den FREE Plan und haben bereits eine Kamera hinzugefügt oder ihr Testzeitraum ist abgelaufen'
                : 'Es konnte keine Kamera hinzugefügt werden')
            }
            {...props}
          />
        )
      }}
    </Mutation>
  )
}

AddCamFormContainer.propTypes = {
  client: PropTypes.any,
}

export default withApollo(AddCamFormContainer)
