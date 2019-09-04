import { GraphQLServer } from 'graphql-yoga'
import signale from 'signale'

import context from './context'
import jobs from './jobs'
import options from './options'
import resolvers from './resolvers'
import webhooks from './webhooks'

const server = new GraphQLServer({
  typeDefs: `${__dirname}/schema.graphql`,
  resolvers,
  context,
  options,
})

webhooks.forEach(hook => {
  server.express[hook.method](...hook.handlers)
})

jobs.forEach(job => setInterval(...job))

server.start(options).then(() => {
  signale.success('Started GraphQL server')
})
