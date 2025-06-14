import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)
    const product = db.products.find((p) => p.ProductID === productId)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !["Pharmacy", "Admin"].includes(user.Role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = Number.parseInt(params.id)
    const productIndex = db.products.findIndex((p) => p.ProductID === productId)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const { name, description, price, requiresPrescription, stock } = await request.json()

    db.products[productIndex] = {
      ...db.products[productIndex],
      Name: name || db.products[productIndex].Name,
      Description: description || db.products[productIndex].Description,
      Price: price ? Number.parseFloat(price) : db.products[productIndex].Price,
      RequiresPrescription:
        requiresPrescription !== undefined ? requiresPrescription : db.products[productIndex].RequiresPrescription,
      Stock: stock !== undefined ? Number.parseInt(stock) : db.products[productIndex].Stock,
    }

    return NextResponse.json(db.products[productIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !["Pharmacy", "Admin"].includes(user.Role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = Number.parseInt(params.id)
    const productIndex = db.products.findIndex((p) => p.ProductID === productId)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    db.products.splice(productIndex, 1)

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
