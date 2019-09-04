import hasha from 'hasha'

import { getCamera } from '../controllers/Camera'
import { getEventUsingOwner } from '../controllers/Events'
import { getUser } from '../controllers/User'
import getPreSignedLink from '../libs/getPreSignedLink'
import { isLoggedIn } from '../libs/permissions'

const { OWN_ENDPOINT = 'http://localhost:3000' } = process.env

const createStaticImageLink = hash => `${OWN_ENDPOINT}/static-image/${hash}`
const createImageHash = buffer =>
  hasha(buffer, { algorithm: 'md5', encoding: 'hex' })

const resolvers = {
  Query: {
    event: (_, { _id }, { auth }) =>
      isLoggedIn(auth)(userId => getEventUsingOwner(_id, userId)),
  },
  Event: {
    owner: ({ owner }) => getUser(owner),
    cam: ({ cam }) => cam && getCamera(cam),
    download: ({ path, buffer, bufferHash }) =>
      path
        ? getPreSignedLink(path)
        : createStaticImageLink(
            bufferHash ? bufferHash : createImageHash(buffer.buffer),
          ),
  },
}

export default resolvers
