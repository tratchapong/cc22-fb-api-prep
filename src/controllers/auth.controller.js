import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import createHttpError from 'http-errors'
import { prisma } from '../lib/prisma.js'
import identityKeyUtil from '../utils/identity-key.util.js'
import { loginSchema, registerSchema } from '../validations/schema.js'
import { createUser, getUserBy } from '../services/user.service.js'


export async function register(req, res, next) {
  // validation
  const data = await registerSchema.parseAsync(req.body)
  const identityKey = data.email ? 'email' : 'mobile'

  // find user for non-duplicate
  // const haveUser = await prisma.user.findUnique({
  //   where: { [identityKey]: data[identityKey] }
  // })
  const haveUser = await getUserBy(identityKey, data[identityKey])
  if (haveUser) {
    return next(createHttpError[409]('This user already register'))
  }

  // create new user in DB
  // const result = await prisma.user.create({ data: data })
  const result = await createUser(data)
  res.json({
    message: 'Register Successful',
    result: result
  })
}

export async function login(req, res, next) {
  // validation
  const data = loginSchema.parse(req.body)
  const identityKey = data.email ? 'email' : 'mobile'

  // find user in DB
  // const foundUser = await prisma.user.findFirst({
  //   where: { [identityKey]: data[identityKey] }
  // })
  const foundUser = await getUserBy(identityKey, data[identityKey])
  if (!foundUser) {
    return next(createHttpError[409]('Invalid login 1'))
  }

  // check password
  let pwOk = await bcrypt.compare(data.password, foundUser.password)
  if (!pwOk) { return next(createHttpError[401]('Invalid Login 2')) }

  //  create token
  const payload = { id: foundUser.id }
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '15d'
  })
  //  rip password, createdAt, updatedAt
  const { password: pw, createdAt, updatedAt, ...userData } = foundUser
  res.json({
    msg: 'Login Successful',
    token: token,
    user: userData
  })
}

export async function getMe(req, res, next) {

  res.json({ message: 'Getme service' })
}