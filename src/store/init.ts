import mongoose from 'mongoose'

export const connectToMongoDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_ADDRESS, { useNewUrlParser: true, ...getAuthForDatabase() })
    console.info('jók vagyunk')
  } catch (e) {
    console.info('szar az egész')
  }
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
