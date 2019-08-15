import jwt from 'jsonwebtoken'

// const secPW = process.env.JWT_PASSWORD

const createToken = (data: any) => {
  return jwt.sign(data, process.env.JWT_PASSWORD || 'default_jwt')
}

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_PASSWORD || 'default_jwt')
  } catch (err) {
    return null
  }
}

export {
  createToken,
  verifyToken
}
