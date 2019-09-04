// @ts-nocheck
import { split } from 'apollo-link'
import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { setContext } from 'apollo-link-context'
import { getMainDefinition } from 'apollo-utilities'
import fetch from 'isomorphic-unfetch'

let apolloClient = null
const sslRequired = process.env.NODE_ENV === 'production'
const address = process.env.GRAPHQL_ADDRESS || 'localhost:4000'

console.log(sslRequired, address)

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

function create(initialState, { getToken }) {
  const ssrMode = !process.browser

  const httpLink = createHttpLink({
    uri: `${sslRequired ? 'https' : 'http'}://${address}`,
    credentials: 'same-origin',
  })

  const authLink = setContext((_, { headers }) => {
    const token = getToken()
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    }
  })

  let link = authLink.concat(httpLink)

  //When in browser
  if (!ssrMode) {
    // create WS Link for subscriptions
    const wsLink = new WebSocketLink({
      uri: `${sslRequired ? 'wss' : 'ws'}://${address}`,
      options: {
        reconnect: true,
        connectionParams: {
          Authorization: getToken(),
        },
      },
    })

    // Override the link variable to dynamicly switch between the Links
    link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      wsLink,
      authLink.concat(httpLink),
    )
  }

  return new ApolloClient({
    connectToDevTools: !ssrMode,
    ssrMode, // Disables forceFetch on the server (so queries are only run once)
    link,
    cache: new InMemoryCache().restore(initialState || {}),
  })
}

export default function initApollo(initialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, options)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options)
  }

  return apolloClient
}
