import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, password, role, address } = await request.json()

    // Check if user already exists
    const existingUser = db.users.find((u) => u.Email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // In production, hash password
    // const passwordHash = await bcrypt.hash(password, 10);
    const passwordHash = "$2b$10$example_hash"

    const newUser = {
      UserID: db.users.length + 1,
      FullName: fullName,
      Email: email,
      Phone: phone,
      PasswordHash: passwordHash,
      Role: role || "Customer",
      Address: address,
      CreatedAt: new Date(),
    }

    db.users.push(newUser)

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        UserID: newUser.UserID,
        FullName: newUser.FullName,
        Email: newUser.Email,
        Role: newUser.Role,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
