import CameraResolvers from './camera'
import UserResolvers from './user'
import TokenResolvers from './token'
import EventResolvers from './event'
import ScalarsResolvers from './scalars'

const composeResolvers = (...resolvers) =>
  resolvers.reduce((accResolver = {}, resolver = {}) => {
    const { Subscription, Query, Mutation, ...restResolvers } = resolver

    const {
      Subscription: ASubscription,
      Query: AQuery,
      Mutation: AMutation,
      ...ARestResolvers
    } = accResolver

    return {
      ...ARestResolvers,
      ...restResolvers,
      Subscription: { ...ASubscription, ...Subscription },
      Query: { ...AQuery, ...Query },
      Mutation: { ...AMutation, ...Mutation },
    }
  })

export default composeResolvers(
  CameraResolvers,
  UserResolvers,
  TokenResolvers,
  EventResolvers,
  ScalarsResolvers,
)
