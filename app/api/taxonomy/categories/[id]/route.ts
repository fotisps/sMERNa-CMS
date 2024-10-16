import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { connectDB } from "@/lib/db"
import Category from "@/models/Category"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await connectDB()
  const category = await Category.findById(params.id).populate('parent')
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 })
  }
  return NextResponse.json(category)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()
  const { name, description, parent } = await request.json()
  const category = await Category.findByIdAndUpdate(params.id, { name, description, parent }, { new: true })
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 })
  }
  return NextResponse.json(category)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()
  const category = await Category.findByIdAndDelete(params.id)
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 })
  }
  return NextResponse.json({ message: "Category deleted successfully" })
}