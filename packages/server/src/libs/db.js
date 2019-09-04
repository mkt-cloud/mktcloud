import Monk from 'monk'
import signale from 'signale'

const { DB_CONNECTION_STRING = 'localhost:27017/cam' } = process.env

const db = Monk(DB_CONNECTION_STRING)

const useIdAsString = () => next => (args, method) =>
  next(args, method).then(res => {
    // if get statement
    if (res && res._id) {
      res._id = res._id.toString()
    }
    // if search
    else if (res && res.map) {
      res.map(x => {
        if (x && x._id) {
          x._id = x._id.toString()
        }
        return x
      })
    }
    return res
  })

db.addMiddleware(useIdAsString)

db.then(() => {
  signale.success(`DB: Connected to ${DB_CONNECTION_STRING}`)
}).catch(e => {
  signale.fatal(`Couldn't connect to MongoDB on ${DB_CONNECTION_STRING}`, e)
})

export default db
