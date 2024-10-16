import { NextResponse } from 'next/server'
import { connectDB, disconnectDB } from "@/lib/db"
import Tag from "@/models/Tag"

export async function GET() {
  try {
    await connectDB()
    const tags = await Tag.find({})
    return NextResponse.json(tags)
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  } finally {
    await disconnectDB()
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const data = await request.json()
    const tag = new Tag(data)
    await tag.save()
    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error("Error creating tag:", error)
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 })
  } finally {
    await disconnectDB()
  }
}