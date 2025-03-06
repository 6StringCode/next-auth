"use client"

import { Button } from '@/components/ui/button'
import { logout } from './actions'

//we're using the server hook here to call the logout function since this is a client side component

export default function LogoutButton() {
  return (
    <Button
      style={{ cursor: "pointer" }}
      size='sm'
      onClick={async () => {
        await logout()
      }
      }>
      Logout
    </Button >
  )
}