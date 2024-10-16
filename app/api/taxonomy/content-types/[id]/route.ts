import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { connectDB } from "@/lib/db"
import ContentType from "@/models/ContentType"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await connectDB()
  const contentType = await ContentType.findById(params.id)
  if (!contentType) {
    return NextResponse.json({ error: "Content Type not found" }, { status: 404 })
  }
  return NextResponse.json(contentType)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()
  const { name, description } = await request.json()
  const contentType = await ContentType.findByIdAndUpdate(params.id, { name, description }, { new: true })
  if (!contentType) {
    return NextResponse.json({ error: "Content Type not found" }, { status: 404 })
  }
  return NextResponse.json(contentType)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()
  const contentType = await ContentType.findByIdAndDelete(params.id)
  if (!contentType) {
    return NextResponse.json({ error: "Content Type not found" }, { status: 404 })
  }
  return NextResponse.json({ message: "Content Type deleted successfully" })
}