export function getDestinationBucket() {
  return process.env.DESTINATION_BUCKET
}

export function getWebhook() {
  return process.env.WEBHOOK
}

export function getWebhookSecret() {
  return process.env.WEBHOOK_SECRET
}

export function getFfmpegParameters() {
  return process.env.FFMPEG_PARAMS.split(' ')
}
