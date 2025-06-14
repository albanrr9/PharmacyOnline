"use client"

import { useAuth } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"
import { AdminDashboard } from "@/components/admin-dashboard"
import { PharmacyDashboard } from "@/components/pharmacy-dashboard"
import { CustomerDashboard } from "@/components/customer-dashboard"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export default function Home() {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">PharmaCare</h1>
            <p className="text-gray-600 mt-2">Online Pharmacy Delivery System</p>
          </div>
          <LoginForm />
        </div>
      </div>
    )
  }

  const renderDashboard = () => {
    switch (user.Role) {
      case "Admin":
        return <AdminDashboard />
      case "Pharmacy":
        return <PharmacyDashboard />
      case "Customer":
        return <CustomerDashboard />
      default:
        return <div>Unknown user role</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">PharmaCare</h1>
              <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{user.Role}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                {user.FullName}
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {user.Role === "Admin" && "Admin Dashboard"}
            {user.Role === "Pharmacy" && "Pharmacy Management"}
            {user.Role === "Customer" && "Browse Medications"}
          </h2>
          <p className="text-gray-600 mt-1">
            {user.Role === "Admin" && "Monitor system-wide operations and analytics"}
            {user.Role === "Pharmacy" && "Manage your inventory and process orders"}
            {user.Role === "Customer" && "Order medications for home delivery"}
          </p>
        </div>

        {renderDashboard()}
      </main>
    </div>
  )
}
