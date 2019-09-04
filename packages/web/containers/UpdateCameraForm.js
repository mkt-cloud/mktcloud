import { graphql, compose, withApollo } from 'react-apollo'
import PropTypes from 'prop-types'
import { toaster } from 'evergreen-ui'
import gql from 'graphql-tag'
import AddCamForm from '../components/AddCamForm'
import Router from 'next/router'
import { GET_CAMS } from './Cams'

export const GET_CAMERA = gql`
  query getCam($id: ID!) {
    camera(_id: $id) {
      _id
      name
      address
      model
      http
      rtsp
      usr
      pwd
    }
  }
`

export const UPDATE_CAMERA = gql`
  mutation UpdateCam(
    $id: ID!
    $name: String
    $model: String
    $address: String
    $http: Int
    $rtsp: Int
    $usr: String
    $pwd: String
  ) {
    updateCamera(
      _id: $id
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
      model
      address
      http
      rtsp
      usr
      pwd
    }
  }
`

export const DELETE_CAMERA = gql`
  mutation DeleteCam($id: ID!) {
    removeCamera(_id: $id) {
      _id
    }
  }
`
const UpdateCamContainer = ({
  updateCamera,
  deleteCamera,
  getCamera,
  error,
  ...props
}) => {
  const { graphQLErrors } = error || {}
  return (
    <AddCamForm
      currentPageIndex={1}
      submitBtn="Aktualisieren"
      executeMutation={updateCamera}
      executeDeleteMutation={deleteCamera}
      error={
        graphQLErrors &&
        graphQLErrors.length &&
        graphQLErrors.find(
          error => !['InvalidHost', 'InvalidCreds'].includes(error.message),
        ) &&
        'Die Kamera konnte nicht aktualisiert werden'
      }
      {...getCamera.camera}
      {...props}
    />
  )
}

UpdateCamContainer.propTypes = {
  client: PropTypes.any,
}

export default compose(
  graphql(GET_CAMERA, {
    name: 'getCamera',
    options: ({ id }) => ({ variables: { id } }),
  }),
  graphql(UPDATE_CAMERA, {
    name: 'updateCamera',
    options: {
      onCompleted: () => {
        toaster.success('Kamera wurde erfolgreich aktualisiert!')
      },
    },
  }),
  graphql(DELETE_CAMERA, {
    name: 'deleteCamera',
    options: {
      onCompleted: () => {
        Router.push('/cams')
        toaster.danger('Kamera wurde erfolgreich gelöscht!')
      },
      update: (cache, { data: { removeCamera } }) => {
        try {
          const { cameras } = cache.readQuery({ query: GET_CAMS })
          cache.writeQuery({
            query: GET_CAMS,
            data: {
              cameras: [...cameras.filter(cam => cam._id !== removeCamera._id)],
            },
          })
        } catch (e) {
          //GET_CAMS wasn't fetched yet, ignore update
        }
      },
    },
  }),
  withApollo,
)(UpdateCamContainer)
