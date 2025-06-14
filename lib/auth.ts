import type { NextRequest } from "next/server"

export interface AuthUser {
  UserID: number
  FullName: string
  Email: string
  Role: "Customer" | "Pharmacy" | "Admin"
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  // In production, implement proper JWT token validation
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return null

  // Mock authentication - return admin user for demo
  return {
    UserID: 1,
    FullName: "Admin User",
    Email: "admin@pharmacy.com",
    Role: "Admin",
  }
}

export function requireAuth(request: NextRequest, allowedRoles?: string[]) {
  const user = getAuthUser(request)
  if (!user) {
    throw new Error("Authentication required")
  }

  if (allowedRoles && !allowedRoles.includes(user.Role)) {
    throw new Error("Insufficient permissions")
  }

  return user
}
