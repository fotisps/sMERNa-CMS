"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function AuthError() {
  const router = useRouter()

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get('error')
    console.error('Authentication error:', error)
  }, [])

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>An error occurred during authentication. Please try again.</AlertDescription>
      </Alert>
      <Button onClick={() => router.push('/login')} className="w-full">
        Back to Login
      </Button>
    </div>
  )
}