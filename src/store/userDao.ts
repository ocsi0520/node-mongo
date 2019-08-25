import userModel, { _IUser, IUser } from '../models/user'
import bcrypt from 'bcrypt'
import { DatabaseResponse, DatabaseResponseStatuses } from '../models/responses'

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
  const followUser: IUser | null = await userModel.findOne({ _id: userId }).exec()
  if (!user || !followUser) {
    return { status: DatabaseResponseStatuses.notFound, value: null }
  }
  const alreadyRequested = isUserAlreadyRequested(user, followUser)
  if (alreadyRequested) {
    const addRequestCompleted = await completeRequest(user, followUser)
    return { status: DatabaseResponseStatuses.ok, value: 'Following created' }
  } else {
    const addPendingCompleted = await addToUserArray(user, followUser, 'pendings')
    const addRequestCompleted = await addToUserArray(followUser, user, 'requests')
    return { status: DatabaseResponseStatuses.ok, value: 'Pending created' }
  }

}

const isUserAlreadyRequested = (user: IUser, followUser: IUser) => {
  if (user.requests == undefined) {
    return false
  }
  const index = user.requests.indexOf(followUser.id)
  return index >= 0
}

const addToUserArray = async (user: IUser, followUser: IUser, nameOfUserArray: string) => {
  let userArray = (user as any)[nameOfUserArray]
  if (userArray == undefined) {
    userArray = []
  }
  // userArray.push(followUser.id)
  const userUpdated = await userModel.findByIdAndUpdate(user.id, { $push: { [nameOfUserArray]: { 'id': followUser.id } } },{ 'new': true, 'upsert': true }, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log(res)
    }

  })

}

// Remove follow user to user friends
const removeUserRequest = async (user: IUser, followUser: IUser) => {
  let requests = user.requests
  const index = requests.indexOf(followUser.id)
  requests.splice(index, 1)
  const userUpdated = await userModel.findByIdAndUpdate(user.id, { requests: requests })
}

// Remove follow user to user friends
const removeUserPending = async (user: IUser, followUser: IUser) => {
  let pendings = user.pendings
  const index = pendings.indexOf(followUser.id)
  pendings.splice(index, 1)
  const userUpdated = await userModel.findByIdAndUpdate(user.id, { pendings: pendings })
}

const completeRequest = async (user: IUser, followUser: IUser) => {
  const userUpdated = addToUserArray(user, followUser, 'friends')
  const followUserUpdated = addToUserArray(followUser, user, 'friends')
  const userFriendsUpdated = removeUserRequest(followUser, user)
  const followUseruserFriendsUpdated = removeUserPending(user, followUser)

}

export default {
  registerUser,
  loginUser,
  getUserById,
  followUser
}
