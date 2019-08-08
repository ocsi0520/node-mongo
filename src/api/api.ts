import { Router, Response, Request } from 'express'
import userDao from '../store/userDao'
import user, { _IUser } from '../models/user'
import { body } from 'express-validator'

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

const isSecurePassword = (plainPassword: string) => {
  const validators: Array<{test: (str: string) => boolean}> = [/[a-z]/, /[A-Z]/, /[0-9]/]
  return validators.every(validator => validator.test(plainPassword))
}

// EXAMINE: bcrypt-ről hablaty
// https://stackoverflow.com/questions/6832445/how-can-bcrypt-have-built-in-salts
const registerUser = async (request: Request, response: Response) => {
  const registerRequest = request.body
  registerRequest.birthDate = new Date(registerRequest.birthDate)
  try {
    await userDao.registerUser(registerRequest)
    response.status(201).send()
  } catch (e) {
    response.status(500).send(e.message)
  }
}

// TODO: login

apiRouter.post('/register', [
  body('birthDate').isISO8601(),
  body('gender').isIn(['male', 'female', 'unknown']),
  body(['name', 'username']).isString().isLength({ min: 2 }),
  body('password').isString().isLength({ min: 8 }).custom(isSecurePassword),
], registerUser)

export default apiRouter
