import userModel, { _IUser, IUser } from '../../models/user'

export const completeRequest = async (user: IUser, followUser: IUser) => {
  await Promise.all([
    addToUserArray(user, 'friends', followUser.id),
    addToUserArray(followUser, 'friends', user.id)
  ])
  await Promise.all([
    removeFromUserArray(user, 'request', followUser.id),
    removeFromUserArray(followUser, 'pendings', user.id)
  ])
}

export const isUserAlreadyRequested = (user: IUser, followUser: IUser) => {
  if (user.requests === undefined) {
    return false
  }
  const index = user.requests.indexOf(followUser.id)
  return index >= 0
}

export const addToUserArray = async (user: IUser, nameOfUserArray: string, itemToAdd: any) => {
  await userModel.findByIdAndUpdate(user.id, { $addToSet: { [nameOfUserArray]: itemToAdd } },{ 'new': true, 'upsert': true }).exec()
}

export const removeFromUserArray = async (user: IUser, nameOfUserArray: string, itemToBeRemoved: any) => {
  await userModel.findByIdAndUpdate(user.id, { $pull: { [nameOfUserArray]: itemToBeRemoved } }).exec()
}
