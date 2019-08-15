import mongoose from 'mongoose'

export const connectToMongoDb = () => {
  return mongoose.connect(process.env.DATABASE_ADDRESS || 'mongodb://localhost:27017/penz', { useNewUrlParser: true, ...getAuthForDatabase() })
}

const getAuthForDatabase = () => {
  if (process.env.DATABASE_USER && process.env.DATABASE_PASSWORD) {
    return { auth: { user: process.env.DATABASE_USER, password: process.env.DATABASE_PASSWORD } }
  }
  return {}
}

export default {
  connectToMongoDb
}
