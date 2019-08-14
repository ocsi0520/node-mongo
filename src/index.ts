// https://developer.okta.com/blog/2018/11/15/node-express-typescript
// https://medium.com/statuscode/dockerising-a-node-js-and-mongodb-app-d22047e2806f
// https://stackoverflow.com/questions/53216884/how-to-connect-to-mongodb-using-node-js-written-in-typescript
import express from 'express'
import { connectToMongoDb } from './store/init'
import apiHandler from './api/api'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())

;(async function () {
  await connectToMongoDb()
})()

app.use('/api', apiHandler)

app.use('*', (req, res) => {
  // EXAMINE: backtick-et elmagyarázni
  res.status(404).send(`Resource not found on '${req.originalUrl}'`)
})

app.listen(3000, () => console.info('Listenning on port 3000'))

// proper http methods, statuses, and other stuffs:
// https://tools.ietf.org/html/rfc7230
// https://tools.ietf.org/html/rfc7231
