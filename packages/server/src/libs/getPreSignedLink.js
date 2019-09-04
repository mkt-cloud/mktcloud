import S3 from 'aws-sdk/clients/s3'

const {
  S3_REGION: region = 'eu-central-1',
  S3_ACCESS_KEY_ID: accessKeyId = 'AKIAII6S3AJUDBVBZKUQ',
  S3_SECRET_ACCESS_KEY: secretAccessKey = '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',
  S3_PROCESSED_BUCKET = 'cam-converted',
} = process.env

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
})

export default (Key, Bucket = S3_PROCESSED_BUCKET, Expires = 60 * 30) =>
  new Promise((res, rej) => {
    s3.getSignedUrl('getObject', { Bucket, Key, Expires }, (err, url) => {
      if (err) rej(err)
      return res(url)
    })
  })
