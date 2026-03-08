import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'
import { prisma } from '../lib/prisma.js'
import identityKeyUtil from '../utils/identity-key.util.js'
import { registerSchema } from '../validations/schema.js'


export async function register(req, res, next) {

 // validation
 const data = await registerSchema.parseAsync(req.body)
 const identityKey = data.email ? 'email' : 'mobile'

 // find user for non-duplicate
 const haveUser = await prisma.user.findUnique({
   where : { [identityKey] : data[identityKey] }})
 if(haveUser) {
   return next(createHttpError[409]('This user already register')) }

// create new user in DB
 const result = await prisma.user.create({data : data})
 res.json({
   msg : 'Register Successful',
   result : result
  }) 
}


export async function login(req, res, next) {

  res.json({message: 'Login service'})
}

export async function getMe(req, res, next) {
  
  res.json({message: 'Getme service'})
}