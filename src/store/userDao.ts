import userModel, { IUser, _IUser } from '../models/user'
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
  const a = new userModel({ ...asd })
  await a.save()
}

export default {
  createExample
}
