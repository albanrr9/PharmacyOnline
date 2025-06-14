export interface User {
  UserID: number
  FullName: string
  Email: string
  Phone?: string
  PasswordHash: string
  Role: "Customer" | "Pharmacy" | "Admin"
  Address?: string
  CreatedAt: Date
}

export interface Product {
  ProductID: number
  PharmacyID: number
  Name: string
  Description?: string
  Price: number
  RequiresPrescription: boolean
  Stock: number
  CreatedAt: Date
  Images?: ProductImage[]
}

export interface ProductImage {
  ImageID: number
  ProductID: number
  ImageUrl: string
  IsPrimary: boolean
  CreatedAt: Date
}

export interface Order {
  OrderID: number
  UserID: number
  PharmacyID: number
  Status: "Placed" | "Accepted" | "Ready" | "Delivered" | "Rejected"
  Total: number
  DeliveryAddress?: string
  Latitude?: number
  Longitude?: number
  CreatedAt: Date
  Items?: OrderItem[]
}

export interface OrderItem {
  OrderItemID: number
  OrderID: number
  ProductID: number
  Quantity: number
  Subtotal: number
  Product?: Product
}

export interface Prescription {
  PrescriptionID: number
  OrderID: number
  ImageUrl: string
  Status: "Pending" | "Verified" | "Rejected"
  VerifiedBy?: number
  CreatedAt: Date
}

// Mock database functions for demo purposes
// In production, replace with actual SQL Server connection
export const db = {
  users: [] as User[],
  products: [] as Product[],
  orders: [] as Order[],
  prescriptions: [] as Prescription[],
}

// Initialize with sample data immediately
db.users = [
  {
    UserID: 1,
    FullName: "Admin User",
    Email: "admin@pharmacy.com",
    Phone: "+1234567890",
    PasswordHash: "$2b$10$example_hash",
    Role: "Admin",
    Address: "123 Admin St, City, State",
    CreatedAt: new Date(),
  },
  {
    UserID: 2,
    FullName: "MediCare Pharmacy",
    Email: "medicare@pharmacy.com",
    Phone: "+1234567891",
    PasswordHash: "$2b$10$example_hash",
    Role: "Pharmacy",
    Address: "456 Health Ave, City, State",
    CreatedAt: new Date(),
  },
  {
    UserID: 3,
    FullName: "John Doe",
    Email: "john@example.com",
    Phone: "+1234567893",
    PasswordHash: "$2b$10$example_hash",
    Role: "Customer",
    Address: "321 Customer Lane, City, State",
    CreatedAt: new Date(),
  },
]

db.products = [
  {
    ProductID: 1,
    PharmacyID: 2,
    Name: "Paracetamol 500mg",
    Description: "Pain relief and fever reducer",
    Price: 5.99,
    RequiresPrescription: false,
    Stock: 100,
    CreatedAt: new Date(),
  },
  {
    ProductID: 2,
    PharmacyID: 2,
    Name: "Amoxicillin 250mg",
    Description: "Antibiotic for bacterial infections",
    Price: 12.99,
    RequiresPrescription: true,
    Stock: 50,
    CreatedAt: new Date(),
  },
  {
    ProductID: 3,
    PharmacyID: 2,
    Name: "Ibuprofen 400mg",
    Description: "Anti-inflammatory pain reliever",
    Price: 7.5,
    RequiresPrescription: false,
    Stock: 75,
    CreatedAt: new Date(),
  },
]
