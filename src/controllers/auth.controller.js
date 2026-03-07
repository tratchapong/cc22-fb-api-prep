import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'
import { prisma } from '../lib/prisma.js'
import identityKeyUtil from '../utils/identity-key.util.js'


export async function register(req, res, next) {
  console.log(req.body)
 const {identity, firstName, lastName, password, confirmPassword} = req.body
 // validation
 if(!identity.trim() || !firstName.trim() || !lastName.trim() || !password.trim() || !confirmPassword.trim()) {
   return next(createHttpError[400]('fill all inputs')) }
 if(confirmPassword !== password) {
   return next(createHttpError[400]('check confirm-password ')) }
 // check Identity is email or mobile
 const identityKey = identityKeyUtil(identity)
 if(!identityKey) {
   return next(createHttpError[400]('identity must be email or phone number')) }
 // find user for non-duplicate
 const haveUser = await prisma.user.findUnique({
   // @ts-ignore
   where : { [identityKey] : identity }})
 if(haveUser) {
   return next(createHttpError[409]('This user already register')) }
 const newUser = {
   [identityKey] : identity,
   password : await bcrypt.hash(password, 10),
   firstName : firstName,
   lastName : lastName }
 const result = await prisma.user.create({data : newUser})
 res.json({
   msg : 'Register Successful',
   result : result }) 

}


export async function login(req, res, next) {

  res.json({message: 'Login service'})
}

export async function getMe(req, res, next) {
  
  res.json({message: 'Getme service'})
}