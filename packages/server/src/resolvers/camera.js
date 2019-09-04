import { STATUS_BY_CODE } from '../constants'
import Camera from '../controllers/Camera'
import Events from '../controllers/Events'
import User from '../controllers/User'
import { canRead, canWrite, isLoggedIn } from '../libs/permissions'

const resolvers = {
  Subscription: {
    camera: {
      subscribe: (_, args, { auth }) =>
        isLoggedIn(auth)(owner => Camera.subscribe(owner, args.events)),
    },
  },
  Query: {
    cameras: (_, args, { auth }) =>
      isLoggedIn(auth)(owner => Camera.find({ ...args, owner: owner })),
    camera: (_, args, { auth }) =>
      canRead(auth, args._id)((_, cam) => Camera.get(cam)),
  },
  Mutation: {
    addCamera: (_, args, { auth }) =>
      isLoggedIn(auth)(owner => Camera.add({ ...args, owner })),
    updateCamera: (_, args, { auth }) =>
      canWrite(auth, args._id)(() => Camera.update(args)),
    removeCamera: (_, args, { auth }) =>
      canWrite(auth, args._id)(() => Camera.remove(args)),
  },
  Camera: {
    owner: ({ owner }) => User.get(owner),
    events: ({ _id }, { options }) => Events.listByCam(_id, options),
    status: ({ status }) => STATUS_BY_CODE[status],
    liveUrl: ({ address, rtsp, http, usr, pwd }) =>
      Camera.getLiveUrl({ host: address, port: rtsp || http, usr, pwd }),
    getMotionDetectConfig: ({ address, http, usr, pwd }) =>
      Camera.getMotionDetectConfig({ address, http, usr, pwd }),
    takeSnap: ({ address, http, usr, pwd, owner, _id }) =>
      Camera.takeSnap({ address, http, usr, pwd, owner, _id }),
  },
}

export default resolvers
