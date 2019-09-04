import { schemas } from '@camcloud/common'
import { UserInputError, withFilter } from 'apollo-server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../config'
import {
  ADDED,
  compose,
  LOGIN,
  PLAN,
  REMOVED,
  RESET_PASSWORD,
  RESET_PASSWORD_MAIL,
  STATUS,
  UPDATED,
} from '../constants'
import db from '../libs/db'
import sendMail, { passwordMail, registerMail } from '../libs/mail'
import {
  cancelSubscription,
  createCustomer,
  createPaymentMethodToken,
  createSubscription,
  updateSubscription,
} from '../libs/payment'
import pubsub from '../libs/pubsub'
import Cameras, { calcExtraCams, countCameras } from './Camera'
import { createToken, deleteToken, validateToken } from './DatabaseToken'
import { createEvent } from './Events'

export const ENTITY = 'USER'
export const USER_ADDED = compose(
  ENTITY,
  ADDED,
)
export const USER_UPDATED = compose(
  ENTITY,
  UPDATED,
)
export const USER_REMOVED = compose(
  ENTITY,
  REMOVED,
)
export const USER_RESET_PASSWORD_MAIL = compose(
  ENTITY,
  RESET_PASSWORD_MAIL,
)
export const USER_RESET_PASSWORD = compose(
  ENTITY,
  RESET_PASSWORD,
)
export const USER_LOGIN = compose(
  ENTITY,
  LOGIN,
)

const SALT_ROUNDS = 12

const users = db.get('user')
users.createIndex('cameras')

export const addUser = async ({
  password: passwordBlank,
  firstName,
  lastName,
  email,
  ...user
}) => {
  const isValid = await schemas.registerSchema.validate({
    password: passwordBlank,
    firstName,
    lastName,
    email,
    ...user,
  })
  console.log(isValid)
  const emailExists = await findUser({ email })
  if (emailExists)
    throw new UserInputError('email already exists', {
      email: 'already exists',
    })
  const password = await bcrypt.hash(passwordBlank, SALT_ROUNDS)
  const customerId = await createCustomer({
    firstName,
    lastName,
    email,
  })
  const newUser = await users.insert({
    ...user,
    firstName,
    lastName,
    email,
    password,
    customerId,
    status: STATUS.DEFAULT,
    plan: PLAN.FREE,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  const { token: dbToken } = await createToken(newUser._id, 'USER_ACTIVATION')
  createEvent({
    owner: newUser._id.toString(),
    type: USER_ADDED,
  })
  pubsub.publish(USER_ADDED, { me: newUser })
  sendMail(registerMail({ firstName, lastName, email, token: dbToken }))
  return newUser
}

export const setUserPassword = async ({ token, newPassword }) => {
  const _id = await validateToken(token, 'RESET_PASSWORD')
  if (!_id) throw new Error("Token isn't valid")
  const updatedUser = await updateUser({ _id, password: newPassword })
  await deleteToken(token)
  createEvent({
    owner: updatedUser._id.toString(),
    type: USER_RESET_PASSWORD,
  })
  return updatedUser
}

export const getUser = _id => {
  return users.findOne({ _id, status: STATUS.DEFAULT })
}

export const findUsers = (query = {}) => {
  return users.find({ ...query, status: STATUS.DEFAULT })
}

export const findUser = (query = {}) => {
  return users.findOne({ ...query, status: STATUS.DEFAULT })
}

export const updateUser = async updateUser => {
  const oldUser = await getUser(updateUser._id)
  if (updateUser.email && updateUser.email !== oldUser.email) {
    const emailExists = await findUser({ email: updateUser.email })
    if (emailExists)
      throw new UserInputError('email already exists', {
        email: 'already exists',
      })
  }
  if (updateUser.password && updateUser.password !== oldUser.password)
    updateUser.password = await bcrypt.hash(updateUser.password, SALT_ROUNDS)

  const updatedUser = await users.findOneAndUpdate(updateUser._id, {
    $set: {
      ...updateUser,
      updatedAt: new Date(),
    },
  })
  pubsub.publish(USER_UPDATED, { me: updatedUser })
  return updatedUser
}

export const removeUser = async id => {
  const removedUser = await users.findOneAndUpdate(id, {
    $set: { status: STATUS.DELETED },
  })
  createEvent({
    owner: removedUser._id.toString(),
    type: USER_REMOVED,
  })
  pubsub.publish(USER_REMOVED, { me: removedUser })
  return removedUser
}

export const subscribeToUsers = (userId, events = []) => {
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
    ({ me: { _id: eventUserId } }) => {
      return eventUserId.toString() === userId.toString()
    },
  )() // needs to be executed, receives args etc. API is too high level.
}

export const loginUser = async ({ email, password, token: dbToken }) => {
  await schemas.loginSchema.validate({ email, password })
  const fetchedUser = await findUser({ email })
  if (!fetchedUser) return { status: 'ERROR' }
  const { password: dbPasswordHash, _id } = fetchedUser
  const passwordMatches = await bcrypt.compare(password, dbPasswordHash)
  if (!passwordMatches) return { status: 'ERROR' }

  if (dbToken) {
    const validToken = await validateToken(dbToken, 'USER_ACTIVATION')
    if (!validToken) return { status: 'ERROR' }
  }

  const cameras = await Cameras.find({ owner: _id })
  const token = jwt.sign({ _id, cameras: cameras.map(x => x._id) }, JWT_SECRET)
  createEvent({
    owner: fetchedUser._id.toString(),
    type: USER_LOGIN,
  })
  return {
    status: 'SUCCESS',
    token,
    owner: _id,
  }
}

export const switchPlan = async (userId, { plan: newPlan, nonce }) => {
  const {
    _id,
    customerId,
    email,
    plan: oldPlan,
    subscriptionId,
  } = await getUser(userId)
  console.log('Switch Plan for user', email, 'from', oldPlan, 'to', newPlan)
  // Create subscription (FREE => PREMIUM) (requires nonce)
  if (oldPlan === PLAN.FREE && newPlan === PLAN.PREMIUM && nonce) {
    const paymentMethodToken = await createPaymentMethodToken({
      customerId,
      paymentMethodNonce: nonce,
    })
    const totalCams = await countCameras({ owner: userId })
    const subscription = await createSubscription({
      planId: newPlan,
      customerId,
      paymentMethodToken,
      extraCams: calcExtraCams(totalCams),
    })
    console.log(subscription)
    if (!subscription.success) throw new Error('Couldnt Subscribe')
    createEvent({
      owner: _id.toString(),
      type: 'SWITCH_PLAN_FREE_PREMIUM',
    })
    return updateUser({
      _id,
      plan: newPlan,
      subscriptionId: subscription.subscription.id,
      activePaymentMethodToken: paymentMethodToken,
    })
  }
  // Cancel Subscription (PREMIUM => FREE)
  else if (oldPlan === PLAN.PREMIUM && newPlan === PLAN.FREE) {
    // TODO: DELETE SUBSCRIPTION
    await cancelSubscription(subscriptionId)
    createEvent({
      owner: _id.toString(),
      type: 'SWITCH_PLAN_PREMIUM_FREE',
    })
    return updateUser({
      _id,
      plan: newPlan,
      subscriptionId: null,
    })
  }
  // Switch payment method (PREMIUM => PREMIUM) (requires nonce)
  else if (oldPlan === PLAN.PREMIUM && newPlan === PLAN.PREMIUM && nonce) {
    // TODO: SWITCH PAYMENT
    const paymentMethodToken = await createPaymentMethodToken({
      customerId,
      paymentMethodNonce: nonce,
    })
    const totalCams = await countCameras({ owner: userId })
    await updateSubscription(
      subscriptionId,
      paymentMethodToken,
      calcExtraCams(totalCams),
    )
    createEvent({
      owner: _id.toString(),
      type: 'SWITCH_PLAN_PREMIUM_PREMIUM',
    })
    return updateUser({
      _id,
      plan: newPlan,
    })
  }
  // else error
  else {
    throw new Error(
      'switchSubscription isnt a valid function with the arguments you provided',
    )
  }
}

export const resetUserPassword = async email => {
  try {
    const user = await findUser({ email })
    if (!user) return 'SUCCESS'
    const token = await createToken(user._id.toString(), 'RESET_PASSWORD')
    const mail = passwordMail(
      { email, firstName: user.firstName, lastName: user.lastName },
      token,
    )
    await sendMail(mail)
    createEvent({
      owner: newUser._id.toString(),
      type: USER_RESET_PASSWORD_MAIL,
    })
    return 'SUCCESS'
  } catch (e) {
    return 'ERROR'
  }
}

export default {
  add: addUser,
  find: findUsers,
  subscribe: subscribeToUsers,
  get: getUser,
  update: updateUser,
  remove: removeUser,
  login: loginUser,
  resetPassword: resetUserPassword,
  setPassword: setUserPassword,
  switchPlan,
}
