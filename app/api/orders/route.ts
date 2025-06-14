import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let orders = db.orders

    // Filter orders based on user role
    if (user.Role === "Customer") {
      orders = orders.filter((o) => o.UserID === user.UserID)
    } else if (user.Role === "Pharmacy") {
      orders = orders.filter((o) => o.PharmacyID === user.UserID)
    }
    // Admin can see all orders

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user || user.Role !== "Customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { pharmacyId, items, deliveryAddress, latitude, longitude } = await request.json()

    // Calculate total
    let total = 0
    for (const item of items) {
      const product = db.products.find((p) => p.ProductID === item.productId)
      if (product) {
        total += product.Price * item.quantity
      }
    }

    const newOrder = {
      OrderID: db.orders.length + 1,
      UserID: user.UserID,
      PharmacyID: pharmacyId,
      Status: "Placed" as const,
      Total: total,
      DeliveryAddress: deliveryAddress,
      Latitude: latitude,
      Longitude: longitude,
      CreatedAt: new Date(),
    }

    db.orders.push(newOrder)

    return NextResponse.json(newOrder)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
