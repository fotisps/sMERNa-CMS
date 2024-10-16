"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contents, setContents] = useState([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    const fetchContents = async () => {
      const res = await fetch("/api/content")
      const data = await res.json()
      setContents(data)
    }
    fetchContents()
  }, [])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="flex justify-between mb-4">
        <Link href="/content/new">
          <Button>Create New Content</Button>
        </Link>
        <Link href="/taxonomy">
          <Button variant="outline">Manage Taxonomy</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contents.map((content: any) => (
          <Card key={content._id}>
            <CardHeader>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>By {content.author.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{content.body.substring(0, 100)}...</p>
            </CardContent>
            <CardFooter>
              <Link href={`/content/${content._id}`}>
                <Button>View</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}