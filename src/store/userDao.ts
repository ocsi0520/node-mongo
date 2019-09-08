import userModel, { _IUser, IUser } from '../models/user'
import bcrypt from 'bcrypt'
import { DatabaseResponse, DatabaseResponseStatuses } from '../models/responses'
import { isUserAlreadyRequested, completeRequest, addToUserArray } from './user-helper/add-operations';

const saltRounds = 10 // TODO: it might worth to check this out: https://www.npmjs.com/package/bcrypt-salt

const registerUser = async (user: _IUser): Promise<DatabaseResponse> => {
  const isUsernameInUse: _IUser | null = await userModel.findOne({ username: user.username }).exec()
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
  const user: _IUser | null = await userModel.findOne({ username }, { __v: 0 }).exec()
  if (!user) {
    return { status: DatabaseResponseStatuses.notFound, value: null }
  }
  const isCorrectPassword = await bcrypt.compare(password, user.password as string)
  // https://stackoverflow.com/questions/32752578/whats-the-appropriate-http-status-code-to-return-if-a-user-tries-logging-in-wit/32752617
  if (!isCorrectPassword) {
    return { status: DatabaseResponseStatuses.unauthorized, value: null }
  }

  // https://stackoverflow.com/questions/33239464/javascript-delete-object-property-not-working

  user.password = undefined

  return { status: DatabaseResponseStatuses.ok, value: user }
}

const getUserById = async (id: string) => {
  const user: _IUser | null = await userModel.findById(id, { __v: 0, password: 0, _id: 0 }).exec()
  if (!user) {
    return { status: DatabaseResponseStatuses.notFound, value: null }
  }
  // user.password = undefined
  return { status: DatabaseResponseStatuses.ok, value: user }
}

const followUser = async (userId: string, followUserId: string) => {
  const user: IUser | null = await userModel.findOne({ _id: userId }).exec()
  const followUser: IUser | null = await userModel.findOne({ _id: followUserId }).exec()
  if (!user || !followUser) {
    return { status: DatabaseResponseStatuses.notFound, value: null }
  }
  const alreadyRequested = isUserAlreadyRequested(user, followUser)
  if (alreadyRequested) {
    const addRequestCompleted = await completeRequest(user, followUser)
    return { status: DatabaseResponseStatuses.ok, value: 'Following created' }
  } else {
    await Promise.all([
      addToUserArray(user, 'pendings', followUser.id),
      addToUserArray(followUser, 'requests', user.id)
    ])
    return { status: DatabaseResponseStatuses.ok, value: 'Pending created' }
  }

}

const getUserByGender = async (gender: string) => {
  const users: _IUser[] = await userModel.find({ gender: gender }, { __v: 0, password: 0, _id: 0 }).exec()
  // user.password = undefined
  return { status: DatabaseResponseStatuses.ok, value: users }
}

export default {
  registerUser,
  loginUser,
  getUserById,
  followUser,
  getUserByGender
}
