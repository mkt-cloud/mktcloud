import { STATUS_BY_CODE } from '../constants'
import Camera from '../controllers/Camera'
import Events from '../controllers/Events'
import User from '../controllers/User'
import { createClientToken } from '../libs/payment'
import { block, isLoggedIn } from '../libs/permissions'

const resolvers = {
  Subscription: {
    user: {
      subscribe: (_, args) => block()(() => User.subscribe(args.events)),
    },
    me: {
      subscribe: (_, args, { auth }) =>
        isLoggedIn(auth)(userId => User.subscribe(userId, args.events)),
    },
  },
  Query: {
    users: (_, args) => block()(() => User.find(args)),
    user: (_, args) => block()(() => User.get(args._id)),
    me: (_, args, { auth }) => isLoggedIn(auth)(userId => User.get(userId)),
  },
  Mutation: {
    login: (_, args) => User.login(args),
    resetPassword: (_, { email }) => User.resetPassword(email),
    setPassword: (_, { token, newPassword }) =>
      User.setPassword({ token, newPassword }),
    addUser: (_, args) => User.add(args),
    updateUser: (_, args) => block()(() => User.update(args)),
    removeUser: (_, args) => block()(() => User.remove(args)),
    updateMe: (_, args, { auth }) =>
      isLoggedIn(auth)(_id => User.update({ ...args, _id })),
    removeMe: (_, args, { auth }) =>
      isLoggedIn(auth)(_id => User.remove({ ...args, _id })),
    switchPlan: (_, args, { auth }) =>
      isLoggedIn(auth)(userId => User.switchPlan(userId, args)),
  },
  User: {
    cameras: ({ _id: owner }) => Camera.find({ owner }),
    events: ({ _id: owner }, { options }) => Events.listByUser(owner, options),
    status: ({ status }) => STATUS_BY_CODE[status],
    clientToken: ({ customerId }) => createClientToken(customerId),
  },
}

export default resolvers
