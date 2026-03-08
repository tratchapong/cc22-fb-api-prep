import { z } from "zod";
import bcrypt from 'bcrypt'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10,15}$/

const identityKey = val => emailRegex.test(val) ? 'email' : mobileRegex.test(val) ? 'mobile' : ''

export const registerSchema = z.object({
   identity: z.string().min(2, "Email or phone-number require")
      .refine(value => emailRegex.test(value) || mobileRegex.test(value), {
         message: "identity must be a valid email or mobile number"
      }),
   firstName: z.string().min(2, "first name is required"),
   lastName: z.string().min(2, "last name is required"),
   password: z.string().min(4, "password at least 4 characters"),
   confirmPassword: z.string().min(4, "confirm password is required"),
}).refine(data => data.password === data.confirmPassword, {
   message: 'confirmPassword must match password',
   path: ['confirmPassword']
}).transform(async data => {
   const output = {
      [identityKey(data.identity)]: data.identity,
      firstName: data.firstName,
      lastName: data.lastName,
      password: await bcrypt.hash(data.password, 8)
   }
   return output
})

export const loginSchema = z.object({
   identity: z.string().min(2, "Email or phone-number require")
      .refine(value => emailRegex.test(value) || mobileRegex.test(value), {
         message: "identity must be a valid email or mobile number"
      }),
   password: z.string().min(4, "password at least 4 characters")
}).transform(data => ({
      [identityKey(data.identity)]: data.identity,
      password: data.password
   })
)