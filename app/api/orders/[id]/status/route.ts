import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !["Pharmacy", "Admin"].includes(user.Role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderId = Number.parseInt(params.id)
    const { status } = await request.json()

    const orderIndex = db.orders.findIndex((o) => o.OrderID === orderId)
    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    db.orders[orderIndex].Status = status

    return NextResponse.json(db.orders[orderIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}
