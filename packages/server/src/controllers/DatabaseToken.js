import db from '../libs/db'
import nanoid from 'nanoid'

const token = db.get('token')
token.createIndex('userId')

export const createToken = async (userId, permission) => {
  const tokenString = nanoid(12)
  try {
    await token.insert({ token: tokenString, userId, permission })
    return tokenString
  } catch (e) {
    return null
  }
}

export const validateToken = async (tokenString, permission) => {
  try {
    const doc = await token.findOne({ token: tokenString, permission })
    return doc.userId
  } catch (e) {
    return false
  }
}

export const deleteToken = tokenToDelete =>
  token.remove({ token: tokenToDelete })

export default {
  create: createToken,
  validate: validateToken,
  delete: deleteToken,
}
