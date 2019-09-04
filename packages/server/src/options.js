import signale from 'signale'

// const IS_DEV = process.env.NODE_ENV !== 'production'

signale.info(`Server runs in '${process.env.NODE_ENV}' environment`)

const config = {
  debug: process.env.DEBUG,
  playground: '/',
  introspection: true,
  // playground: IS_DEV ? '/' : false,
  // introspection: IS_DEV,
}

export default config
