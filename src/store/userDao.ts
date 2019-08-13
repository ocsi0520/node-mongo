import userModel, { _IUser, IUser } from '../models/user'
import bcrypt from 'bcrypt'
import { DatabaseResponse, DatabaseResponseStatuses } from '../models/responses'

const saltRounds = 10 // TODO: it might worth to check this out: https://www.npmjs.com/package/bcrypt-salt

const registerUser = async (user: _IUser): Promise<DatabaseResponse> => {
  const isUsernameInUse: _IUser = await userModel.findOne({ username: user.username })
  if (isUsernameInUse) {
    return {
      status: DatabaseResponseStatuses.duplicate,
      value: `User with '${user.username}' already exists`
    }
  }

  const hashedPassword = await bcrypt.hash(user.password, saltRounds)
  user.password = hashedPassword
  await userModel.create(user)
  delete user.password

  return { status: DatabaseResponseStatuses.created, value: user }
}

// EXAMINE: deconstructions, spread operatort elmagyarázni
const loginUser = async ({ username, password }: {username: string, password: string}): Promise<DatabaseResponse> => {
  const user: _IUser = await userModel.findOne({ username }, { __v: 0, _id: 0 })
  if (!user) {
    return { status: DatabaseResponseStatuses.notFound, value: null }
  }
  const isCorrectPassword = await bcrypt.compare(password, user.password)
  // https://stackoverflow.com/questions/32752578/whats-the-appropriate-http-status-code-to-return-if-a-user-tries-logging-in-wit/32752617
  if (!isCorrectPassword) {
    return { status: DatabaseResponseStatuses.unauthorized, value: null }
  }

  // https://stackoverflow.com/questions/33239464/javascript-delete-object-property-not-working

  user.password = undefined
  return { status: DatabaseResponseStatuses.ok, value: user }
}

export default {
  registerUser,
  loginUser
}
