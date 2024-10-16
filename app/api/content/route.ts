import { NextResponse } from 'next/server'
import { connectDB, disconnectDB } from "@/lib/db"
import Content from "@/models/Content"

export async function GET() {
  try {
    await connectDB()
    const contents = await Content.find({})
      .populate('author', 'name email')
      .populate('contentType')
      .populate('categories')
      .populate('tags')
    return NextResponse.json(contents)
  } catch (error) {
    console.error("Error fetching contents:", error)
    return NextResponse.json({ error: "Failed to fetch contents" }, { status: 500 })
  } finally {
    await disconnectDB()
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const data = await request.json()
    const content = new Content(data)
    await content.save()
    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error("Error creating content:", error)
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 })
  } finally {
    await disconnectDB()
  }
}