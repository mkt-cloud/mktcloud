import { schemas } from '@camcloud/common'
import { ValidationError } from 'apollo-server'
import assert from 'assert'
import axios from 'axios'
import { withFilter } from 'graphql-subscriptions'
import nanoid from 'nanoid/async'

import { ADDED, compose, REMOVED, SHOT, STATUS, UPDATED } from '../constants'
import { buildRequestCamCGI } from '../libs/camcgi'
import db from '../libs/db'
import { updateSubscriptionForUser } from '../libs/payment'
import pubsub from '../libs/pubsub'
import setupCamera from '../libs/setupCamera'
import { createEvent } from './Events'
import { getUser } from './User'

const CONTAINER_MANAGER =
  process.env.CONTAINER_MANAGER || 'https://container.rahrt.me'
const CAMS_ENDPOINT = process.env.CAMS_ENDPOINT || 'https://cams.rahrt.me'

export const calcExtraCams = totalCams => (totalCams <= 2 ? 0 : totalCams - 2)

export const ENTITY = 'CAMERA'
export const CAMERA_ADDED = compose(
  ENTITY,
  ADDED,
)
export const CAMERA_UPDATED = compose(
  ENTITY,
  UPDATED,
)
export const CAMERA_REMOVED = compose(
  ENTITY,
  REMOVED,
)
export const CAMERA_SHOT = compose(
  ENTITY,
  SHOT,
)

const cameras = db.get('camera')
cameras.createIndex('owner')

const canAddMoreCams = async (userId, totalCams) => {
  const { plan, createdAt } = await getUser(userId)
  const isInTrial = new Date(createdAt) > new Date(Date.now() - 2628e6) // 2628e6 = 14days in ms
  const isPremium = plan !== 'FREE'
  const canAddMoreCams = isPremium || (isInTrial && totalCams < 1)

  return canAddMoreCams
}

export const addCamera = async camera => {
  await validateCamera(camera)

  const totalCams = await countCameras({ owner: camera.owner })
  const canAddMoreCamsResult = await canAddMoreCams(camera.owner, totalCams)
  if (!canAddMoreCamsResult) {
    throw new ValidationError('LimitExceeded')
  }

  const ftpUser = await nanoid(6)
  const ftpPass = await nanoid(12)

  setupCamera(
    {
      host: camera.address,
      port: camera.http,
      usr: camera.usr,
      pwd: camera.pwd,
    },
    { username: ftpUser, password: ftpPass },
  )
  updateSubscriptionForUser(camera.owner, calcExtraCams(totalCams))
  const { timeZone } = await buildRequestCamCGI({
    host: camera.address,
    port: camera.http,
    usr: camera.usr,
    pwd: camera.pwd,
  })('getSystemTime')
  const newCamera = await cameras.insert({
    ...camera,
    owner: camera.owner,
    status: STATUS.DEFAULT,
    ftpUser,
    ftpPass,
    timeZone,
    online: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  createEvent({
    owner: newCamera.owner,
    type: CAMERA_ADDED,
    cam: newCamera._id,
  })
  pubsub.publish(CAMERA_ADDED, { camera: newCamera })
  return newCamera
}

export const validateCamera = async camera => {
  let validCamera
  // Schema Test
  try {
    validCamera = await schemas.addCameraSchema.validate(camera)
  } catch (e) {
    throw new ValidationError('InvalidHost')
  }

  // HTTP Port and address test
  try {
    const { status: cameraAddressHttpStatus } = await axios.head(
      `http://${validCamera.address}:${validCamera.http}/cgi-bin/CGIProxy.fcgi`,
      { timeout: 6000 },
    )
    assert(cameraAddressHttpStatus === 200)
  } catch (e) {
    throw new ValidationError('InvalidHost')
  }

  // Try cam creds
  try {
    const camCgiController = buildRequestCamCGI({
      host: validCamera.address,
      port: validCamera.http,
      usr: validCamera.usr,
      pwd: validCamera.pwd,
    })
    const cgiResponse = await camCgiController('getDevState')
    assert(cgiResponse.result === 0)
  } catch (e) {
    console.log(e)
    throw new ValidationError('InvalidCreds')
  }
}

export const getCamera = id => {
  return cameras.findOne({ _id: id, status: STATUS.DEFAULT })
}

export const findCameras = (query = {}) => {
  return cameras.find({ ...query, status: STATUS.DEFAULT })
}

export const countCameras = (query = {}) => {
  return cameras.count({ ...query, status: STATUS.DEFAULT })
}

export const findCamera = (query = {}) => {
  return cameras.findOne({ ...query, status: STATUS.DEFAULT })
}

export const updateCamera = async arg => {
  const { setMotionDetectConfig, ptzMove, ...updateCamera } = arg

  const oldCamera = await getCamera(updateCamera._id)
  const mergedCamera = { ...oldCamera, ...updateCamera }
  await validateCamera(mergedCamera)

  if (setMotionDetectConfig && Object.keys(setMotionDetectConfig).length) {
    const oldMotionDetectConfig = await getMotionDetectConfigCamera({
      address: mergedCamera.address,
      http: mergedCamera.http,
      pwd: mergedCamera.pwd,
      usr: mergedCamera.usr,
    })
    const newMotionDetectConfig = {
      ...oldMotionDetectConfig,
      ...setMotionDetectConfig,
    }
    await buildRequestCamCGI({
      host: mergedCamera.address,
      port: mergedCamera.http,
      usr: mergedCamera.usr,
      pwd: mergedCamera.pwd,
    })('setMotionDetectConfig', newMotionDetectConfig)
  }

  if (ptzMove) {
    const camCgi = buildRequestCamCGI({
      host: mergedCamera.address,
      port: mergedCamera.http,
      usr: mergedCamera.usr,
      pwd: mergedCamera.pwd,
    })
    switch (ptzMove) {
      case 'UP':
        camCgi('ptzMoveUp')
        break
      case 'DOWN':
        camCgi('ptzMoveDown')
        break
      case 'LEFT':
        camCgi('ptzMoveLeft')
        break
      case 'RIGHT':
        camCgi('ptzMoveRight')
        break
      case 'UPLEFT':
        camCgi('ptzMoveTopLeft')
        break
      case 'UPRIGHT':
        camCgi('ptzMoveTopRight')
        break
      case 'DOWNLEFT':
        camCgi('ptzMoveBottomLeft')
        break
      case 'DOWNRIGHT':
        camCgi('ptzMoveBottomRight')
        break
      case 'RESET':
        camCgi('ptzReset')
        break
    }
    if (
      [
        'UP',
        'DOWN',
        'LEFT',
        'RIGHT',
        'UPLEFT',
        'UPRIGHT',
        'DOWNLEFT',
        'DOWNRIGHT',
      ].includes(ptzMove)
    )
      setTimeout(() => camCgi('ptzStopRun'), 500)
  }

  const updatedCamera = await updateCamera_insecure(updateCamera)
  createEvent({
    owner: updatedCamera.owner,
    type: CAMERA_UPDATED,
    cam: updatedCamera._id,
  })
  pubsub.publish(CAMERA_UPDATED, { camera: updatedCamera })
  return updatedCamera
}

export const updateCamera_insecure = updateCamera =>
  cameras.findOneAndUpdate(updateCamera._id, {
    $set: { ...updateCamera, updatedAt: new Date() },
  })

export const removeCamera = async id => {
  const removedCamera = await cameras.findOneAndUpdate(id, {
    $set: { status: STATUS.DELETED },
  })
  const totalCams = await countCameras({ owner: removedCamera.owner })
  updateSubscriptionForUser(removedCamera.owner, calcExtraCams(totalCams))
  createEvent({
    owner: removedCamera.owner,
    type: CAMERA_REMOVED,
    cam: removedCamera._id,
  })
  pubsub.publish(CAMERA_REMOVED, { camera: removedCamera })
  return removedCamera
}

export const getLiveUrlCameras = async ({ host, port, usr, pwd }) => {
  try {
    const { data } = await axios.post(CONTAINER_MANAGER, {
      host,
      port,
      usr,
      pwd,
    })
    return `${CAMS_ENDPOINT}/${data.secret}/index.m3u8`
  } catch (e) {
    console.log(e)
    return ''
  }
}

export const getMotionDetectConfigCamera = async ({
  address,
  http,
  usr,
  pwd,
}) => {
  return buildRequestCamCGI({
    host: address,
    port: http,
    usr,
    pwd,
  })('getMotionDetectConfig')
}

export const takeSnapCamera = async ({
  address,
  http,
  usr,
  pwd,
  owner,
  _id,
}) => {
  const { buffer, contentType, base64 } = await buildRequestCamCGI({
    host: address,
    port: http,
    usr,
    pwd,
  })('snapPicture2')

  createEvent({
    buffer,
    contentType,
    owner,
    type: CAMERA_SHOT,
    cam: _id,
  })

  return base64
}

export const subscribeToCameras = (ownerId, events = []) => {
  return withFilter(
    () =>
      pubsub.asyncIterator(
        events.map(x =>
          compose(
            ENTITY,
            x,
          ),
        ),
      ),
    ({ camera: { owner: camOwner } }) => {
      return camOwner.toString() === ownerId.toString()
    },
  )() // needs to be executed, receives args etc. API is too high level.
}

export default {
  add: addCamera,
  find: findCameras,
  subscribe: subscribeToCameras,
  get: getCamera,
  update: updateCamera,
  remove: removeCamera,
  getLiveUrl: getLiveUrlCameras,
  validate: validateCamera,
  getMotionDetectConfig: getMotionDetectConfigCamera,
  takeSnap: takeSnapCamera,
}
