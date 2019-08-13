export const httpStatuses = {
  ok: 200,
  created: 201,
  accepted: 202,
  noContent: 204,
  notCorrectSyntactically: 400, // bad request
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  notCorrectSemantically: 422, // Unprocessable entity
  locked: 423,
  tooManyRequests: 429
}

export enum DatabaseResponseStatuses {
  ok = 'ok',
  created = 'created',
  notFound = 'notFound',
  unauthorized = 'unauthorized',
  forbidden = 'forbidden',
  locked = 'locked',
  duplicate = 'conflict'
}

export interface DatabaseResponse {
  status: DatabaseResponseStatuses
  value: any
}
