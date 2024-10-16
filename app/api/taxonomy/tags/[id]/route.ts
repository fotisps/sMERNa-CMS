import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { connectDB } from "@/lib/db"
import Tag from "@/models/Tag"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await connectDB()
  const tag = await Tag.findById(params.id)
  if (!tag) {
    return NextResponse.json({ error: "Tag not found" }, { status: 404 })
  }
  return NextResponse.json(tag)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()
  const { name } = await request.json()
  const tag = await Tag.findByIdAndUpdate(params.id, { name }, { new: true })
  if (!tag) {
    return NextResponse.json({ error: "Tag not found" }, { status: 404 })
  }
  return NextResponse.json(tag)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()
  const tag = await Tag.findByIdAndDelete(params.id)
  if (!tag) {
    return NextResponse.json({ error: "Tag not found" }, { status: 404 })
  }
  return NextResponse.json({ message: "Tag deleted successfully" })
}