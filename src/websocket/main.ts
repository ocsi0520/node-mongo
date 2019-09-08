import { Server as WsServer, ServerOptions } from 'ws'

const init = (httpServer: ServerOptions['server']) => {
  const ws = new WsServer({
    server: httpServer
  })
  ws.on('connection', request => {
    request.on('message', data => {
      console.info(`recieved data: ${data}`)
    })
    request.on('close', (code, reason) => {
      console.info(`closed, ${code}: ${reason}`)
    })
  })
  console.info('ws server created')
}

export default init
