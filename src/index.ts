// https://developer.okta.com/blog/2018/11/15/node-express-typescript
// https://medium.com/statuscode/dockerising-a-node-js-and-mongodb-app-d22047e2806f
// https://stackoverflow.com/questions/53216884/how-to-connect-to-mongodb-using-node-js-written-in-typescript
import express from 'express'
const app = express()

app.use('/', (req, res) => {
  res.send('Hello world')
})

app.listen(3000, () => console.info('Listenning on port 3000'))
