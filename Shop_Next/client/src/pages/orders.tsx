import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import CartSidebar from "@/components/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { Order, OrderItem, Product } from "@shared/schema";

interface OrderWithItems extends Order {
  orderItems: (OrderItem & { product: Product })[];
}

export default function Orders() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: orders = [], isLoading: ordersLoading, error } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (isLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CartSidebar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8" data-testid="text-page-title">Order History</h1>
        
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg mb-4" data-testid="text-no-orders">
                No orders found
              </p>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here
              </p>
              <Button asChild data-testid="button-start-shopping">
                <a href="/products">Start Shopping</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold" data-testid={`text-order-id-${order.id}`}>
                        Order #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-muted-foreground" data-testid={`text-order-date-${order.id}`}>
                        Placed {formatDistanceToNow(new Date(order.createdAt!), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        className={getStatusColor(order.status)}
                        data-testid={`badge-order-status-${order.id}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <p className="text-lg font-bold mt-2" data-testid={`text-order-total-${order.id}`}>
                        ${order.totalPrice}
                      </p>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.orderItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center space-x-4 p-3 bg-muted rounded-lg"
                        data-testid={`div-order-item-${item.id}`}
                      >
                        <img
                          src={item.product.imageUrl || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=80"}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          data-testid={`img-order-item-${item.id}`}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium" data-testid={`text-item-name-${item.id}`}>
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-muted-foreground" data-testid={`text-item-quantity-${item.id}`}>
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold" data-testid={`text-item-price-${item.id}`}>
                            ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-testid={`button-view-details-${order.id}`}
                      >
                        View Details
                      </Button>
                      {order.status === "shipped" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          data-testid={`button-track-package-${order.id}`}
                        >
                          Track Package
                        </Button>
                      )}
                    </div>
                    <Button 
                      size="sm"
                      data-testid={`button-reorder-${order.id}`}
                    >
                      Reorder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
