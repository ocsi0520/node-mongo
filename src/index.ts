// https://developer.okta.com/blog/2018/11/15/node-express-typescript
// https://medium.com/statuscode/dockerising-a-node-js-and-mongodb-app-d22047e2806f
// https://stackoverflow.com/questions/53216884/how-to-connect-to-mongodb-using-node-js-written-in-typescript
import express from 'express'
import dotenv from 'dotenv'
import { createServer } from 'http'
dotenv.config()

import { connectToMongoDb } from './store/init'
import apiHandler from './api/api'
import cookieParser from 'cookie-parser'
import createWsServer from './websocket/main'
import { Socket } from 'net'

const app = express()
const httpServer = createServer(app)

app.use(express.json())
app.use(cookieParser())

;(function () {
  connectToMongoDb().catch((reason) => {
    console.error('could not connect to database')
    console.error('might be no mongo? try `docker start mongo`')
    console.error('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
    console.error('||||||||||||||||||||||||||||||||||||||||||||')
    console.error('____________________________________________')
    console.error(reason)
    process.exit(1)
  })
})()

app.use('/api', apiHandler)

// httpServer.on('upgrade', (request: express.Request, socket: Socket, head: Headers) => {
//   const cookie = request.cookies
//   console.info({ cookie })
//   // console.info({ request })
//   // console.info({ socket })
//   // console.info({ head })
//   // socket.destroy()
// })
createWsServer(httpServer)

app.use('/', (req, res) => {
  // EXAMINE: backtick-et elmagyarázni
  res.status(404).send(`Resource not found on '${req.originalUrl}'`)
})

httpServer.listen(3000, () => console.info('Listenning on port 3000'))

// proper http methods, statuses, and other stuffs:
// https://tools.ietf.org/html/rfc7230
// https://tools.ietf.org/html/rfc7231
