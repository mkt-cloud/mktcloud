import express from 'express'

import { findCamera } from '../controllers/Camera'
import { createEvent } from '../controllers/Events'
import { getUser } from '../controllers/User'
import sendMail, { camAlarmMail } from '../libs/mail'

const {
  WEBHOOK_SECRET = 'j3Y60z^0_OVg^m&W3ofS+w@a5L&pa6_-Ux|Z=Pu1f=2Vk*oU4l0_nD9OHtBjTRIqauGXDb6f59I^zPoTurfNZNKqQi*$7X?#qL*54N3jMTORkaUTwuBx^W+0bvFE*=O|p^gt8h6bolSvzZD3R9QN47MWj=@wZE9ATx&DbY@1xLQYE17UAkmtgoOQ@6Vg2mLwsuldaVszfWwjjg+sOs9cQjSAzI9t0XG5f*p-4rmJ@cgoAP_pR+AgRTo#5N85MAn5',
} = process.env

export default {
  method: 'post',
  handlers: [
    '/webhooks/camAlarm',
    express.json(),

    (req, res, next) => {
      const bearer = req.get('Authorization')
      if (bearer !== `Bearer ${WEBHOOK_SECRET}`) return res.status(403).end()
      if (!req.body.path) return res.status(400).end()
      return next()
    },

    async (req, res) => {
      const { path } = req.body
      const ftpUser = path.split('/')[0]
      const camObj = await findCamera({ ftpUser })

      if (!camObj) return res.status(404).end()

      const { owner, _id: cam } = camObj
      const user = await getUser(owner)

      const event = await createEvent({
        path,
        ftpUser,
        owner,
        cam,
        type: 'CAMERA_ALARM',
      })

      sendMail(camAlarmMail(user, camObj, event.date))

      return res.json(event)
    },
  ],
}
