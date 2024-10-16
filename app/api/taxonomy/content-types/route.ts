import { NextResponse } from 'next/server'
import { connectDB, disconnectDB } from "@/lib/db"
import ContentType from "@/models/ContentType"

export async function GET() {
  try {
    await connectDB()
    const contentTypes = await ContentType.find({})
    return NextResponse.json(contentTypes)
  } catch (error) {
    console.error("Error fetching content types:", error)
    return NextResponse.json({ error: "Failed to fetch content types" }, { status: 500 })
  } finally {
    await disconnectDB()
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const data = await request.json()
    const contentType = new ContentType(data)
    await contentType.save()
    return NextResponse.json(contentType, { status: 201 })
  } catch (error) {
    console.error("Error creating content type:", error)
    return NextResponse.json({ error: "Failed to create content type" }, { status: 500 })
  } finally {
    await disconnectDB()
  }
}