import { Router, Response, Request } from 'express'
import userDao from '../store/userDao'
import { _IUser } from '../models/user'

const apiRouter = Router()

apiRouter.get('/createExample', createExampleHandler)

async function createExampleHandler (request: Request, response: Response) {
  try {
    await userDao.createExample()
    response.send('successfull')
  } catch (e) {
    response.status(500).send(e.message)
  }
}

// TODO: overhack
const isSecurePassword = (plainPassword: string) => {
  const validators: Array<{test: (str: string) => boolean}> = [/[a-z]/, /[A-Z]/, /[0-9]/]
  return validators.every(validator => validator.test(plainPassword))
}

const isValidDate = (date: any) => {
  return date instanceof Date && !isNaN(date.valueOf())
}

const isString = (str: any) => {
  return typeof(str) === 'string' || str instanceof String
}

// validálás:
// megvan az összes attribútuma és azok típusai is megfelelőek
// megfelelő intervallumba esnek ezek az értékek (pl a jelszó legalább 8 karakteres)
const isValidUser = (user: any) => {
  // typic side-effect
  const userBirthDate = new Date(user.birthDate)
  user.birthDate = userBirthDate
  return (
    user &&
    isValidDate(user.birthDate) &&
    ['male', 'female', 'unknown'].includes(user.gender) &&
    isString(user.name) && user.name.length > 2 &&
    isString(user.password) && isSecurePassword(user.password) &&
    isString(user.username) && user.username.length > 2
  )
}

// EXAMINE: bcrypt-ről hablaty
// https://stackoverflow.com/questions/6832445/how-can-bcrypt-have-built-in-salts
const registerUser = async (request: Request, response: Response) => {
  const registerRequest = request.body
  if (!isValidUser(registerRequest)) {
    response.status(400).send('Invalid register request')
    return
  }
  try {
    await userDao.registerUser(registerRequest)
    response.status(201).send()
  } catch (e) {
    response.status(500).send(e.message)
  }
}

// TODO: login

apiRouter.post('/register', registerUser)

export default apiRouter
