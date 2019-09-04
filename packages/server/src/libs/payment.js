import braintree from 'braintree'

import { getUser } from '../controllers/User'

const {
  BT_ENV = 'Sandbox',
  BT_MERCHANT_ID: merchantId = 's57jdwxm9snp7kx9',
  BT_PUBLIC_KEY: publicKey = 'hp96k5zw2x4kpjjv',
  BT_PRIVATE_KEY: privateKey = 'b68df8a3bfe1d3b33c9ba219dfabed5b',
} = process.env

const gateway = braintree.connect({
  environment: braintree.Environment[BT_ENV],
  merchantId,
  publicKey,
  privateKey,
})

export default gateway

const createCustomerError = () =>
  new Error(`Cant create Costumer at Payment Provider`)
export const createCustomer = customer =>
  gateway.customer
    .create(customer)
    .then(result => {
      if (!result.success) {
        throw createCustomerError
      }
      return result.customer.id
    })
    .catch(() => {
      throw createCustomerError
    })

const createClientTokenError = cusId =>
  new Error(`Cant create ClientToken for Customer ${cusId}`)
export const createClientToken = customerId =>
  gateway.clientToken
    .generate({ customerId })
    .then(result => {
      if (!result.success) {
        throw createClientTokenError(customerId)
      }
      return result.clientToken
    })
    .catch(() => {
      throw createClientTokenError(customerId)
    })

const createPaymentMethodTokenError = customerId =>
  new Error(`Cant create PaymentMethod for Customer ${customerId}`)
export const createPaymentMethodToken = ({
  paymentMethodNonce,
  customerId,
}) => {
  return gateway.paymentMethod
    .create({
      customerId,
      paymentMethodNonce,
      options: {
        makeDefault: true,
      },
    })
    .then(result => {
      if (!result.success) {
        throw createPaymentMethodTokenError(customerId)
      }
      return result.paymentMethod.token
    })
    .catch(() => {
      throw createPaymentMethodTokenError(customerId)
    })
}

const calcExtraCamsObj = (extraCams, mode = 'create') => {
  switch (mode) {
    case 'create':
      return extraCams <= 0
        ? {}
        : {
            addOns: {
              add: [
                {
                  inheritedFromId: 'extra_cam',
                  quantity: extraCams,
                },
              ],
            },
          }
    case 'update':
      return extraCams <= 0
        ? {
            addOns: {
              remove: ['extra_cam'],
            },
          }
        : {
            addOns: {
              update: [
                {
                  existingId: 'extra_cam',
                  quantity: extraCams,
                },
              ],
            },
          }
    default:
      throw new Error('Unknown mode for function "calcExtraCamsObj"')
  }
}

const createSubscriptionError = (customerId, planId) =>
  new Error(`Cant subscribe Customer ${customerId} to Plan ${planId}`)
export const createSubscription = ({
  planId,
  paymentMethodToken,
  customerId,
  extraCams = 0,
}) => {
  console.log(extraCams)
  return gateway.subscription
    .create({
      paymentMethodToken,
      planId,
      ...calcExtraCamsObj(extraCams, 'create'),
    })
    .then(result => {
      if (!result.success) {
        console.error(result)
        throw createSubscriptionError(customerId, planId)
      }
      return result
    })
    .catch(err => {
      console.error(err)
      throw createSubscriptionError(customerId, planId)
    })
}

const cancelSubscriptionError = subId =>
  new Error(`Cant cancel Subscription ${subId}`)
export const cancelSubscription = subId =>
  gateway.subscription
    .cancel(subId)
    .then(result => {
      if (!result.success) {
        throw cancelSubscriptionError(subId, planId)
      }
      return result
    })
    .catch(() => {
      throw cancelSubscriptionError(subId, planId)
    })

const updateSubscriptionError = subId =>
  new Error(`Cant update Subscription ${subId}`)
export const updateSubscription = (
  subId,
  paymentMethodToken,
  extraCams = 0,
) => {
  console.log('updateSubscription', extraCams)
  return gateway.subscription
    .update(subId, {
      paymentMethodToken,
      ...calcExtraCamsObj(extraCams, 'update'),
    })
    .then(result => {
      if (!result.success) {
        throw updateSubscriptionError(subId, planId)
      }
      return result
    })
    .catch(() => {
      throw updateSubscriptionError(subId, planId)
    })
}

export const updateSubscriptionForUser = async (userId, extraCams = 0) => {
  const user = await getUser(userId)
  return updateSubscription(
    user.subscriptionId,
    user.activePaymentMethodToken,
    extraCams,
  )
}
