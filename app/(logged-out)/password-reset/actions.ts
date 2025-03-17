"use server"

import { auth } from '@/auth'
import db from '@/db/drizzle'
import { passwordResetTokens } from '@/db/passwordResetTokensSchema'
import { users } from '@/db/usersSchema'
import { randomBytes } from 'crypto'
import { eq } from 'drizzle-orm'

export const passwordReset = async (emailAddress: string) => {

  const session = await auth()

  if (!!session?.user?.id) {
    return {
      error: true,
      message: "You are already logged in"
    }
  }

  const [user] = await db.select({
    id: users.id,
  }).from(users)
    .where(eq(users.email, emailAddress))

  if (!user) {
    return
  }

  const passwordResetToken = randomBytes(32).toString('hex')
  const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60)

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    token: passwordResetToken,
    tokenExpiry
  }).onConflictDoUpdate({
    //if the user already has a token, update it
    target: passwordResetTokens.userId,
    set: {
      token: passwordResetToken,
      tokenExpiry
    }
  })

  console.log('passwordResetToken', passwordResetToken)
}