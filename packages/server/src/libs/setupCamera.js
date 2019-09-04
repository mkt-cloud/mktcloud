import { buildRequestCamCGI } from './camcgi'

const { FTP_ADDRESS = 'ftp://165.227.170.30' } = process.env

export default async (
  { host, port, https = false, usr, pwd },
  { username, password, ...restFtpOpts },
) => {
  const cmdr = buildRequestCamCGI({ host, port, https, usr, pwd })

  const ftpOptions = {
    ...{ ftpAddr: FTP_ADDRESS, ftpPort: 21 },
    username,
    password,
    ...restFtpOpts,
  }

  await cmdr('setFtpConfig', {
    ftpAddr: ftpOptions.ftpAddr,
    ftpPort: ftpOptions.ftpPort,
    mode: 0,
    userName: ftpOptions.username,
    password: ftpOptions.password,
  })

  await cmdr('setRecordPath', { path: 2 })

  await cmdr('setMotionDetectConfig', {
    isEnable: 1,
    linkage: 8,
    snapInterval: 1,
    sensitivity: 2,
    triggerInterval: 5,
    isMovAlarmEnable: 1,
    isPirAlarmEnable: 1,
    schedule0: 281474976710655,
    schedule1: 281474976710655,
    schedule2: 281474976710655,
    schedule3: 281474976710655,
    schedule4: 281474976710655,
    schedule5: 281474976710655,
    schedule6: 281474976710655,
    area0: 1023,
    area1: 1023,
    area2: 1023,
    area3: 1023,
    area4: 1023,
    area5: 1023,
    area6: 1023,
    area7: 1023,
    area8: 1023,
    area9: 1023,
  })
}
