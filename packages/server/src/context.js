import signale from 'signale'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './config'

const handleToken = async token => {
  try {
    return await jwt.verify(token.replace('Bearer ', ''), JWT_SECRET)
  } catch (e) {
    signale.warn('Malicious Request detected')
  }
}

const context = async ({ request: httpReq, connection: wsReq }) => {
  let auth = undefined
  // HTTP
  if (httpReq && httpReq.headers && httpReq.headers.authorization) {
    auth = await handleToken(httpReq.headers.authorization)
  }
  // WS
  else if (wsReq && wsReq.context && wsReq.context.Authorization) {
    auth = await handleToken(wsReq.context.Authorization)
  }
  return { auth }
}

export default context
