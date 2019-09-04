import axios from 'axios'

import { getDestinationBucket, getFfmpegParameters, getWebhook, getWebhookSecret } from './src/env'
import { ffmpeg, ffprobe } from './src/ffmpeg'
import { deleteObject, download, getFileInformation, uploadFolder } from './src/s3'

const WEBHOOK_SECRET = getWebhookSecret()

export const main = async (event, context, callback) => {
  const { eventName, bucket, key } = getFileInformation(event)

  console.log(
    `Received ${eventName} for item in bucket: ${bucket}, key: ${key}`,
  )

  try {
    const destPath = await download(bucket, key)
    await ffprobe(destPath)
    const outputPath = await ffmpeg(destPath, 'mp4', getFfmpegParameters())
    const destBucket = getDestinationBucket()
    const [destKey] = await uploadFolder(destBucket, key, outputPath)
    console.log(destKey)
    await axios.post(
      getWebhook(),
      {
        path: destKey,
      },
      {
        headers: {
          Authorization: `Bearer ${WEBHOOK_SECRET}`,
        },
      },
    )
    await deleteObject(bucket, key)
    callback(null, `Success: ${key}`)
  } catch (error) {
    callback(null, `Error: ${key}`)
  }
}
