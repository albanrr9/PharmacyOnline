"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ShoppingCart, Search, MapPin, Clock } from "lucide-react"

interface Product {
  ProductID: number
  Name: string
  Description?: string
  Price: number
  Stock: number
  RequiresPrescription: boolean
}

interface Order {
  OrderID: number
  Status: string
  Total: number
  CreatedAt: string
}

interface CartItem {
  product: Product
  quantity: number
}

export function CustomerDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    }
  }

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.ProductID === product.ProductID)
      if (existing) {
        return prev.map((item) =>
          item.product.ProductID === product.ProductID ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.ProductID !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) => prev.map((item) => (item.product.ProductID === productId ? { ...item, quantity } : item)))
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.Price * item.quantity, 0)
  }

  const handleCheckout = async () => {
    try {
      const orderData = {
        pharmacyId: 2, // Default pharmacy for demo
        items: cart.map((item) => ({
          productId: item.product.ProductID,
          quantity: item.quantity,
        })),
        deliveryAddress: "123 Customer Address",
        latitude: 40.7128,
        longitude: -74.006,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        setCart([])
        setIsCartOpen(false)
        fetchOrders()
        alert("Order placed successfully!")
      }
    } catch (error) {
      console.error("Failed to place order:", error)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Placed":
        return "bg-blue-500"
      case "Accepted":
        return "bg-yellow-500"
      case "Ready":
        return "bg-orange-500"
      case "Delivered":
        return "bg-green-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search medications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogTrigger asChild>
            <Button className="relative">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart ({cart.length})
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Shopping Cart</DialogTitle>
              <DialogDescription>Review your items before checkout</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground">Your cart is empty</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.product.ProductID} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{item.product.Name}</p>
                        <p className="text-sm text-muted-foreground">${item.product.Price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.ProductID, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.ProductID, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.product.ProductID)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Total: ${getCartTotal().toFixed(2)}</span>
                    </div>
                    <Button onClick={handleCheckout} className="w-full">
                      Place Order
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Browse Products</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.ProductID}>
                <CardHeader>
                  <CardTitle className="text-lg">{product.Name}</CardTitle>
                  <CardDescription>{product.Description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">${product.Price}</span>
                      <span className="text-sm text-muted-foreground">Stock: {product.Stock}</span>
                    </div>
                    <div className="flex gap-2">
                      {product.RequiresPrescription && <Badge variant="secondary">Prescription Required</Badge>}
                      {product.Stock < 10 && <Badge variant="outline">Low Stock</Badge>}
                    </div>
                    <Button onClick={() => addToCart(product)} disabled={product.Stock === 0} className="w-full">
                      {product.Stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Track your medication orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-center text-muted-foreground">No orders yet</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.OrderID} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.OrderID}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(order.CreatedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm">Total: ${order.Total.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.Status)}>{order.Status}</Badge>
                        <div className="mt-2">
                          <Button variant="outline" size="sm">
                            <MapPin className="h-4 w-4 mr-2" />
                            Track Order
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
