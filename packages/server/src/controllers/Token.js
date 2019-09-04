import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config'
import pubsub from '../libs/pubsub'
import { UPDATED, STATUS_DEFAULT_STRING, compose } from '../constants'
import Cameras from './Camera'
import { withFilter } from 'apollo-server'

export const ENTITY = 'TOKEN'
export const TOKEN_UPDATED = compose(
  ENTITY,
  UPDATED,
)

export const refreshToken = async _id => {
  const cameras = await Cameras.find({ owner: _id })
  const token = jwt.sign({ _id, cameras: cameras.map(x => x._id) }, JWT_SECRET)
  const response = {
    status: STATUS_DEFAULT_STRING,
    token,
    owner: _id,
  }
  pubsub.publish(TOKEN_UPDATED, { refreshedToken: response })
  return response
}

export const subscribeToTokens = ownerId => {
  return withFilter(
    () => pubsub.asyncIterator([TOKEN_UPDATED]),
    ({ refreshedToken: { owner: tokenOwner } }) =>
      tokenOwner.toString() === ownerId.toString(),
  )() // needs to be executed, receives args etc. API is too high level.
}

export default {
  subscribe: subscribeToTokens,
  refresh: refreshToken,
}
