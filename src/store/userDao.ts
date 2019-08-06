import userModel, { _IUser } from '../models/user'
import bcrypt from 'bcrypt'

const saltRounds = 10 // TODO: it might worth to check this out: https://www.npmjs.com/package/bcrypt-salt

/*
  username: string
  password: string
  name: string
  gender: 'female' | 'male' | 'unknown'
  birthDate: Date
*/
const createExample = async () => {
  const asd: _IUser = {
    birthDate: new Date(),
    gender: 'female',
    name: 'Alma',
    password: 'Kortek',
    username: 'petez'
  }
  await userModel.create({ ...asd })
}

const registerUser = async (user: _IUser) => {
  const hashedPassword = await bcrypt.hash(user.password, saltRounds)
  user.password = hashedPassword
  await userModel.create(user)
}

export default {
  createExample,
  registerUser
}
