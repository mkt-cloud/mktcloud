import crypto from 'crypto'
import Docker from 'dockerode'
import greenlock from 'greenlock-express'
import http from 'http'
import https from 'https'
import { json, run, send } from 'micro'
import allowCors from 'micro-cors'
import { del, get, post, router } from 'microrouter'
import nanoid from 'nanoid'
import redirectHttps from 'redirect-https'
import rmfr from 'rmfr'
import handleServe from 'serve-handler'
import UrlPattern from 'url-pattern'
import waitOn from 'wait-on'

import db from './db'

const glx = greenlock.create({
  server: 'https://acme-v02.api.letsencrypt.org/directory', // prod
  // server: 'https://acme-staging-v02.api.letsencrypt.org/directory', // staging
  version: 'draft-11',
  approveDomains: ['cams.rahrt.me', 'container.rahrt.me', 'dev.rahrt.me'],
  configDir: `${__dirname}/.certs/`,

  email: 'janek.rahrt@me.com',
  agreeTos: true,
})

http
  .createServer(glx.middleware(redirectHttps()))
  .listen(80, () => console.log('Listening for ACME http-01 challenges'))

const microHttps = fn =>
  https.createServer(glx.httpsOptions, (req, res) => run(req, res, fn))

const cors = allowCors()

const docker = new Docker({ socketPath: '/var/run/docker.sock' })
const Converter = db.get('converter')

async function f() {
  await docker.pull('janek2601/converter')

  // docker run -p 8080:8080 -e \"VIDEO_ADDRESS=$VIDEO_ADDRESS\" -e \"SECRET=$SECRET\" converter
  const spawnConverter = async (name, videoAddress) => {
    const containerExists = await Converter.findOne({ name })
    if (containerExists) {
      return containerExists
    } else {
      const secret = nanoid(42)
      const { _id: dbId } = await Converter.insert({
        secret,
        name,
        containerId: null,
        lastCall: Date.now(),
      })
      const newContainer = await docker.createContainer({
        Image: 'janek2601/converter',
        Env: [`VIDEO_ADDRESS=${videoAddress}`, `SECRET=${secret}`],
        HostConfig: {
          Binds: ['/tmp/stream:/tmp/stream'],
        },
      })
      const containerInfo = await newContainer.inspect()

      const converterInfo = await Converter.update(
        { _id: dbId },
        { $set: { containerId: containerInfo.Id } },
      )
      await newContainer.start()
      return converterInfo
    }
  }

  const createInstance = async req => {
    const { host, port, usr, pwd } = await json(req)

    const videoAddress = `rtsp://${usr}:${pwd}@${host}:${port}/videoMain`
    const name = crypto
      .createHash('sha256')
      .update(videoAddress)
      .digest('hex')
    const { secret } = await spawnConverter(name, videoAddress)
    await waitOn({
      resources: [`/tmp/stream/${secret}/1.ts`],
      window: 250, // 1/4 sec
      timeout: 10000, // 10 sec
    })
    return { secret }
  }

  const deleteInstance = async secret => {
    const container = await Converter.findOneAndDelete({
      secret,
    })

    try {
      container && (await docker.getContainer(container.containerId).stop())
    } catch (e) {
      console.log("Can't stop container", container.containerId)
    }
    try {
      container && (await docker.getContainer(container.containerId).remove())
    } catch (e) {
      console.log("Can't remove container", container.containerId)
    }
    try {
      container && (await rmfr(`/tmp/stream/${secret}`))
    } catch (e) {
      console.log("Can't remove files", container.containerId)
    }

    console.log('Deleted', secret)

    return container
  }

  const deleteInstanceRoute = async (req, res) => {
    const { secret } = req.params
    const container = await deleteInstance(secret)

    return send(res, container ? 200 : 404)
  }

  const creatorServer = microHttps(
    cors(
      router(
        post('/', createInstance),
        del('/:secret', deleteInstanceRoute),
        get(new UrlPattern('/:secret/*'), (req, res) => {
          const { secret } = req.params
          console.log(new Date().toISOString(), 'updated', secret)
          Converter.update({ secret }, { $set: { lastCall: Date.now() } })
          return handleServe(req, res, {
            public: '/tmp/stream',
            directoryListing: false, //must be false or secrets are unsave
          })
        }),
      ),
    ),
  )

  creatorServer.listen(443, () => {
    console.log('Creator live at :443')
  })

  const deleteInstancesWithoutActionForXms = 10 * 60 * 1000 // 10 Minuten
  console.log(
    'Will delete Instances which are inactive for 10 Minutes, every 5 Minutes',
  )
  setInterval(async () => {
    console.log('check for invalid instances')
    const invalidThreshold = Date.now() - deleteInstancesWithoutActionForXms
    const invalidInstances = await Converter.find({
      lastCall: { $lte: invalidThreshold },
    })
    return invalidInstances.map(x => x.secret).map(deleteInstance)
  }, deleteInstancesWithoutActionForXms / 2) // 5 Minuten
}
f()
