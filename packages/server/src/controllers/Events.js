import { AuthenticationError } from 'apollo-server'
import hasha from 'hasha'

import { compose, UPDATED } from '../constants'
import db from '../libs/db'
import { getCamera } from './Camera'
import { getUser } from './User'

export const ENTITY = 'EVENT'
export const EVENT_UPDATED = compose(
  ENTITY,
  UPDATED,
)
const events = db.get('event')
events.createIndex('owner')
events.createIndex('cam')
events.createIndex('ftpUser')

export const createEvent = ({ buffer, ...restEvent } = {}) => {
  const bufferHash = hasha(buffer, { algorithm: 'md5', encoding: 'hex' })
  return events.insert({ buffer, bufferHash, ...restEvent, date: new Date() })
}

export const getEventImage = hash =>
  events
    .findOne({ bufferHash: hash }, { fields: { buffer: 1, contentType: 1 } })
    .then(({ buffer, contentType }) => ({
      buffer: buffer.buffer, //unwrap
      contentType,
    }))

export const getEvent = async eventId => {
  const event = await events.findOne({ _id: eventId })
  const cam = await getCamera(event.owner)
  return {
    ...event,
    cam: cam && cam._id.toString(),
  }
}

export const getEventUsingOwner = async (eventId, owner) => {
  const event = await getEvent(eventId)
  if (event.owner === owner.toString()) {
    return event
  } else {
    throw new AuthenticationError()
  }
}

const addEventOptionstoQuery = (
  query,
  type = [],
  fromDate,
  toDate,
  device = [],
) => {
  const newQuery = {
    ...query,
  }
  // filter type
  if (type.length) {
    newQuery.type = {
      $in: type,
    }
  }

  // filter device
  if (device.length) {
    newQuery.cam = {
      $in: device,
    }
  }

  // fromDate
  if (fromDate) {
    const newFrom =
      new Date(fromDate * 1000) > newQuery.date.$gte
        ? new Date(fromDate * 1000)
        : newQuery.date.$gte
    newQuery.date = {
      ...(newQuery.date || {}),
      $gte: newFrom,
    }
  }
  // toDate
  if (toDate) {
    const newTo = new Date(toDate * 1000)
    newQuery.date = {
      ...(newQuery.date || {}),
      $lte: newTo,
    }
  }

  return newQuery
}

export const listEventsByUser = async (
  owner,
  { skip = 0, limit = 20, type = [], fromDate, toDate, device = [] } = {},
) => {
  const user = await getUser(owner)
  const query = addEventOptionstoQuery(
    {
      owner,
      date: {
        // 6048e5 = 7 days in ms
        // 2628e6 = 30 days in ms
        $gte: new Date(Date.now() - (user.plan === 'FREE' ? 6048e5 : 2628e6)),
      },
    },
    type,
    fromDate,
    toDate,
    device,
  )

  const data = await events.find(query, {
    sort: { date: -1 },
    skip,
    limit,
  })
  const countEvents = await events.count(query)
  return {
    total: countEvents,
    data,
  }
}

export const listEventsByCam = async (
  camId,
  { skip = 0, limit = 20, type = [], fromDate, toDate } = {},
) => {
  const { owner } = await getCamera(camId)
  const { plan } = await getUser(owner)

  const query = addEventOptionstoQuery(
    {
      cam: camId,
      date: {
        // 6048e5 = 7 days in ms
        // 2628e6 = 30 days in ms
        $gte: new Date(Date.now() - (plan === 'FREE' ? 6048e5 : 2628e6)),
      },
    },
    type,
    fromDate,
    toDate,
  )
  const data = await events.find(query, {
    sort: { date: -1 },
    skip,
    limit,
  })
  const countEvents = await events.count(query)
  return {
    total: countEvents,
    data,
  }
}

export default {
  create: createEvent,
  listByUser: listEventsByUser,
  listByCam: listEventsByCam,
}
