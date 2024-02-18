import chalk from 'chalk'
import os from 'os'
import fs from 'fs-extra'

let localIP = ''
function getLocalIP() {
  if (!localIP) {
    localIP = 'localhost'
    const interfaces = os.networkInterfaces()
    for (const devName in interfaces) {
      const isEnd = interfaces[devName]?.some((item) => {
        if (
          item.family === 'IPv4' &&
          item.address !== '127.0.0.1' &&
          !item.internal
        ) {
          localIP = item.address
          return true
        }
        return false
      })
      if (isEnd) {
        break
      }
    }
  }
  return localIP
}

const existsSync = fs.existsSync
const writeFile = fs.writeFile
const removeSync = fs.removeSync
const copySync = fs.copySync
export { chalk, getLocalIP, existsSync, writeFile, removeSync, copySync }
