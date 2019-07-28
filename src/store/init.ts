import mongoose from 'mongoose'

export const connectToMongoDb = async () => {
  try {
    await mongoose.connect('mongodb://mongo:27017/penz', {useNewUrlParser: true});
    console.info('jók vagyunk')
  } catch (e) {
    console.info('szar az egész')
  }
}

export default {
  connectToMongoDb
}