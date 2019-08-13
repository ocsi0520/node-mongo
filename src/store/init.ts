import mongoose from 'mongoose'

// TODO: read address from environment variable

export const connectToMongoDb = async () => {
  try {
    // await mongoose.connect('mongodb://mongo:27017/penz', { useNewUrlParser: true })
    await mongoose.connect('mongodb://localhost:27017/penz', { useNewUrlParser: true })
    console.info('jók vagyunk')
  } catch (e) {
    console.info('szar az egész')
  }
}

export default {
  connectToMongoDb
}
