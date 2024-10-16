import { NextResponse } from 'next/server'
import { connectDB, disconnectDB } from "@/lib/db"
import Category from "@/models/Category"

export async function GET() {
  try {
    await connectDB()
    const categories = await Category.find({}).populate('parent')
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  } finally {
    await disconnectDB()
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const data = await request.json()
    const category = new Category(data)
    await category.save()
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  } finally {
    await disconnectDB()
  }
}