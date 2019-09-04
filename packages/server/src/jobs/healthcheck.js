import PQueue from 'p-queue'
import signale from 'signale'

import { PLAN } from '../constants'
import {
  findCameras,
  updateCamera_insecure,
  validateCamera,
} from '../controllers/Camera'
import { createEvent } from '../controllers/Events'
import { findUsers, getUser } from '../controllers/User'
import sendMail, { camOfflineMail } from '../libs/mail'

const queue = new PQueue({ concurrency: 5 })

let count = 0
queue.on('active', () => {
  signale.info(`Working on item #${++count}. Pending: ${queue.pending}`)
})

const handler = async cam => {
  try {
    await validateCamera(cam)
    signale.success(`Camera ${cam.name} is reachable`)

    if (!cam.online) {
      updateCamera_insecure({ ...cam, online: true })
      createEvent({
        owner: cam.owner,
        type: 'CAMERA_HEALTH_CHECK_ONLINE',
        cam: cam._id,
      })
    }
  } catch (e) {
    signale.error(`Camera ${cam.name} isn't reachable`)
    const user = await getUser(cam.owner)

    await Promise.all([
      updateCamera_insecure({ ...cam, online: false }),
      createEvent({
        owner: cam.owner,
        type: 'CAMERA_HEALTH_CHECK_OFFLINE',
        cam: cam._id,
      }),
      sendMail(camOfflineMail(user, cam, Date.now())),
    ])
  }
}

export default [
  async () => {
    const users = await findUsers({ plan: PLAN.PREMIUM })
    const userIds = users.map(u => u._id)
    const cameras = await findCameras({ owner: { $in: userIds } })
    signale.await(`${cameras.length} Cameras to check`)
    const handlers = cameras.map(cam => () => handler(cam))
    await queue.addAll(handlers)
    signale.complete('All Cameras checked')
  },
  5 * 60 * 1000,
]
