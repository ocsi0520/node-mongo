import { Router, Response, Request, NextFunction } from 'express'
import userDao from '../store/userDao'
import { _IUser } from '../models/user'
import { body, validationResult } from 'express-validator'
import { httpStatuses } from '../models/responses'
import { createToken, verifyToken } from '../auth/jwt'

const getUserIdFromToken = (token: string) => {
  const { id: userId } = verifyToken(token) as any
  return userId
}

const isValidRequest = (request: Request, response: Response) => {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    response.status(422).json({ errors: errors.array() })
    return false
  }
  return true
}

const apiRouter = Router()

const isSecurePassword = (plainPassword: string) => {
  const validators: Array<{test: (str: string) => boolean}> = [/[a-z]/, /[A-Z]/, /[0-9]/]
  return validators.every(validator => validator.test(plainPassword))
}

// EXAMINE: bcrypt-ről hablaty
// https://stackoverflow.com/questions/6832445/how-can-bcrypt-have-built-in-salts
const registerUser = async (request: Request, response: Response) => {
  if (!isValidRequest(request, response)) { return }

  const registerRequest = request.body
  try {
    const registerResponse = await userDao.registerUser(registerRequest)
    const statusCode = httpStatuses[registerResponse.status]
    response.status(statusCode).send(registerResponse.value)
  } catch (e) {
    response.status(500).send(e.message)
  }
}

const loginUser = async (request: Request, response: Response) => {
  if (!isValidRequest(request, response)) { return }

  const loginRequest = request.body
  try {
    const loginResponse = await userDao.loginUser(loginRequest)
    const statusCode = httpStatuses[loginResponse.status]
    const value = loginResponse.value
    if (value) {
      const token = createToken({ id: value._id })
      response.cookie('token', token, { maxAge: 15 * 60 * 1000, httpOnly: true }).status(httpStatuses.ok).send(token)
    } else {
      response.status(statusCode).send(value)
    }
  } catch (e) {
    response.status(500).send(e.message)
  }
}

const getMyProfile = async (request: Request, response: Response) => {
  const userId: string = request.body.userId
  try {
    const databaseResponse = await userDao.getUserById(userId)
    const httpStatus = httpStatuses[databaseResponse.status]
    response.status(httpStatus).send(databaseResponse.value)
  } catch (e) {
    response.status(httpStatuses.internalError).send()
  }
}

const tokenHandler = (request: Request, response: Response, next: NextFunction) => {
  const token = request.cookies.token
  const { id: userId } = verifyToken(token) as any
  if (!userId) {
    response.status(httpStatuses.notCorrectSemantically).send('token is missing, login please')
    return
  }
  request.body.userId = userId
  next()
}

const follow = async (request: Request, response: Response) => {
  // if (!isValidRequest(request, response)) { return }
  const userId = getUserIdFromToken(request.cookies.token)
  const followingUserId = request.body.followingUserId
  if (userId && followingUserId) {
    try {
      const databaseResponse = await userDao.followUser(userId, followingUserId)
      response.status(httpStatuses.ok).send(databaseResponse.value)
    } catch (e) {
      response.status(httpStatuses.notCorrectSyntactically).send()
    }
  } else {
    response.status(httpStatuses.notCorrectSemantically).send()
  }
}

apiRouter.post('/login', [
  body(['username','password']).isString()
], loginUser)

apiRouter.post('/register', [
  body('birthDate').isISO8601().withMessage(`'birthDate' must be a valid ISO8601 date`).toDate(),
  body('gender').isIn(['male', 'female', 'unknown']).withMessage(`'gender' must be 'female', 'male' or 'unknown'`),
  body(['name', 'username']).isString().isLength({ min: 2 }).withMessage(`'name' and 'username' must be a string with at least 2 characters`),
  body('password').isString().isLength({ min: 8 }).custom(isSecurePassword).withMessage(`'password' must be at least 8 characters and must contain a number, a capital and a lower letter`),
], registerUser)

apiRouter.use('/', tokenHandler)

apiRouter.get('/myProfile', getMyProfile)

apiRouter.post('/follow', follow)

export default apiRouter
