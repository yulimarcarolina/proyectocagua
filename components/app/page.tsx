"use client"

import LoginForm from "@/components/auth/login-form"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const { login } = useAuth()

  return (
    <LoginForm
      onAuthenticate={(user) => {
        console.log("User authenticated:", user)
        login(user)
      }}
    />
  )
}
