// This file doesn't go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel
const { createServer } = require('http')
const { parse } = require('url')
const UrlPattern = require('url-pattern')
const next = require('next')
console.log('start')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const camRoute = new UrlPattern('/cam/:id')
const resetPasswordRoute = new UrlPattern('/reset-password/:token')
const activationRoute = new UrlPattern('/activate/:token')

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    const camRouteMatch = camRoute.match(pathname)
    if (camRouteMatch)
      return app.render(req, res, '/cam', { ...query, ...camRouteMatch })
    const resetPasswordRouteMatch = resetPasswordRoute.match(pathname)
    if (resetPasswordRouteMatch)
      return app.render(req, res, '/reset-password', {
        ...query,
        ...resetPasswordRouteMatch,
      })
    const activationRouteMatch = activationRoute.match(pathname)
    if (activationRouteMatch)
      return app.render(req, res, '/signin', {
        ...query,
        ...activationRouteMatch,
      })
    return handle(req, res, parsedUrl)
  }).listen(3000, err => {
    if (err) throw err
    console.log('Ready on http://localhost:3000')
  })
})