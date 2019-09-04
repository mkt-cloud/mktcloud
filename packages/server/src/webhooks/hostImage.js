export default {
  method: 'get',
  handlers: [
    '/static-image/:hash',
    async (req, res) => {
      const md5Regex = /^[a-f0-9]{32}$/g
      if (!md5Regex.test(req.params.hash)) res.sendStatus(400)
      const { buffer, contentType } = await getEventImage(req.params.hash)
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': buffer.length,
      })
      res.end(buffer)
    },
  ],
}
