import Token from '../controllers/Token'
import { isLoggedIn } from '../libs/permissions'
import User from '../controllers/User'

const resolvers = {
  Subscription: {
    refreshedToken: {
      subscribe: (_, args, { auth }) =>
        isLoggedIn(auth)(owner => Token.subscribe(owner)),
    },
  },
  Mutation: {
    refreshToken: (_, args, { auth }) =>
      isLoggedIn(auth)(userId => Token.refresh(userId)),
  },
  Token: {
    owner: ({ owner }) => User.get(owner),
  },
}

export default resolvers
