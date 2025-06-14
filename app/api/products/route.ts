import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pharmacyId = searchParams.get("pharmacyId")
    const search = searchParams.get("search")

    let products = db.products

    if (pharmacyId) {
      products = products.filter((p) => p.PharmacyID === Number.parseInt(pharmacyId))
    }

    if (search) {
      products = products.filter(
        (p) =>
          p.Name.toLowerCase().includes(search.toLowerCase()) ||
          p.Description?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user || !["Pharmacy", "Admin"].includes(user.Role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, price, requiresPrescription, stock } = await request.json()

    const newProduct = {
      ProductID: db.products.length + 1,
      PharmacyID: user.Role === "Admin" ? 2 : user.UserID, // Default to pharmacy 2 for admin
      Name: name,
      Description: description,
      Price: Number.parseFloat(price),
      RequiresPrescription: requiresPrescription || false,
      Stock: Number.parseInt(stock) || 0,
      CreatedAt: new Date(),
    }

    db.products.push(newProduct)

    return NextResponse.json(newProduct)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
