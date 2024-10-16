import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { connectDB } from "@/lib/db"
import Content from "@/models/Content"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await connectDB()
  const content = await Content.findById(params.id).populate('author', 'name email')
  if (!content) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 })
  }
  return NextResponse.json(content)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()
  const { title, body, tags, status } = await request.json()
  const content = await Content.findByIdAndUpdate(params.id, {
    title,
    body,
    tags,
    status,
    updatedAt: Date.now(),
  }, { new: true })
  if (!content) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 })
  }
  return NextResponse.json(content)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()
  const content = await Content.findByIdAndDelete(params.id)
  if (!content) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 })
  }
  return NextResponse.json({ message: "Content deleted successfully" })
}