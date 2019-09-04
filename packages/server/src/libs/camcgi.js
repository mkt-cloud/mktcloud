import axios from 'axios'
import querystring from 'querystring'
import util from 'util'
import { parseString } from 'xml2js'
import { regexs } from '@camcloud/common'

const parseXml = util.promisify(parseString)

export const createBase64 = (contentType, buffer) => {
  const base64 = buffer.toString('base64')
  return `data:${contentType};base64,${base64}`
}

// http://ce9175.myfoscam.org/cgi-bin/CGIProxy.fcgi?cmd=getIPInfo&usr=admin&pwd=
export const buildRequestCamCGI = ({
  host,
  port,
  https = false,
  usr,
  pwd,
}) => async (cmd, params) => {
  const query = querystring.stringify({ usr, pwd, cmd, ...params })
  const isIpv6 = regexs.ipv6Regex.test(host)
  const normalizedHost = isIpv6 ? `[${host}]` : host
  try {
    const isBinary = ['snapPicture2'].includes(cmd)
    const response = await axios.get(
      `${
        https ? 'https' : 'http'
      }://${normalizedHost}:${port}/cgi-bin/CGIProxy.fcgi?${query}`,
      isBinary ? { responseType: 'arraybuffer' } : {},
    )

    // exclude some cmds
    if (isBinary) {
      const buffer = Buffer.from(response.data, 'binary')
      const contentType = response.headers['content-type'].toLowerCase()
      const base64 = createBase64(contentType, buffer)

      return {
        buffer,
        contentType,
        base64,
      }
    }

    const parsedResponse = await parseXml(response.data)

    const valueParser = val => {
      const isNumber = /^-?\d+$/.test(val)
      return isNumber ? parseInt(val) : decodeURIComponent(val)
    }
    const convertedResponse = Object.assign(
      {},
      ...Object.entries(parsedResponse['CGI_Result']).map(([key, value]) => {
        const isSingle = value && value.length && value.length === 1

        const newValue = isSingle
          ? valueParser(value[0])
          : value.map(valueParser)

        return {
          [key]: newValue,
        }
      }),
    )

    return convertedResponse
  } catch (e) {
    throw e
  }
}
