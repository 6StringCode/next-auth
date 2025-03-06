'use server'

import db from '@/db/drizzle';
import { users } from '@/db/usersSchema';
import { passwordMatchSchema } from '@/validation/passwordMatchSchema';
import { hash } from 'bcryptjs';
import { z } from 'zod'

export const registerUser = async ({ email, password, passwordConfirm }: {
  email: string,
  password: string,
  passwordConfirm: string
}) => {

  //validate data first
  const newUserSchema = z.object({
    email: z.string().email(),
  }).and(passwordMatchSchema);

  //using .parse() will throw an error if the data is invalid but safeParse won't throw an error, just return boolean/object.
  const newUserValidation = newUserSchema.safeParse({
    email, password, passwordConfirm
  })

  if (!newUserValidation.success) {
    // return newUserValidation.error.errors;
    return {
      error: true,
      message: newUserValidation.error.issues[0]?.message ?? "An Error Occurred"
    }
  }

  const hashedPassword = await hash(password, 10);

  await db.insert(users).values({
    email,
    password: hashedPassword
  })
};