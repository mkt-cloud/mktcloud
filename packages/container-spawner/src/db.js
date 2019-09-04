import Monk from 'monk'

const { DB_CONNECTION_STRING = 'localhost:27017/cam' } = process.env

console.log(`DB: Connected to ${DB_CONNECTION_STRING}`)

export default Monk(DB_CONNECTION_STRING)
