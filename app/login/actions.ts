'use server'

import { signIn } from '@/auth';
import { passwordSchema } from '@/validation/passwordSchema';
import { z } from 'zod';

export const loginWithCredentials = async ({ email, password }: {
  email: string,
  password: string
}) => {
  //validate data first
  const loginSchema = z.object({
    email: z.string().email(),
    password: passwordSchema
  })

  const loginValidation = loginSchema.safeParse({
    email, password
  })

  if (!loginValidation.success) {
    return {
      error: true,
      message: loginValidation.error.issues[0]?.message ?? "An Error Occurred"
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false
    })
  } catch (error: any) { }
}