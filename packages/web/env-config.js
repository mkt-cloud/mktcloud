const prod = process.env.NODE_ENV
const address = process.env.GRAPHQL_ADDRESS

module.exports = {
  'process.env.NODE_ENV': prod,
  'process.env.GRAPHQL_ADDRESS': address,
}
