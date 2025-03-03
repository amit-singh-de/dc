import React from "react";
import { Card } from "./ui/card";
import { Clock, Package, ShoppingCart } from "lucide-react";
import Button from "./ui/button";

interface OrderHistoryItem {
  id: string;
  productName: string;
  orderDate: string;
  imageUrl: string;
  price: number;
  productUrl?: string;
}

interface OrderHistoryProps {
  orders?: OrderHistoryItem[];
}

const OrderHistory = ({
  orders = [],
  isLoading = false,
  onReorder = (id: string) => {},
}: OrderHistoryProps & {
  isLoading?: boolean;
  onReorder?: (id: string) => void;
}) => {
  return (
    <div className="w-full min-h-[800px] bg-background p-4 md:p-6">
      <div className="flex flex-col gap-4 max-w-full md:max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Products Due for Reorder</h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-6 bg-card text-center">
            <div className="flex flex-col items-center gap-4">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              <h3 className="font-medium text-lg">
                No products due for reorder
              </h3>
              <p className="text-muted-foreground">
                Products that need to be reordered will appear here.
              </p>
            </div>
          </Card>
        ) : (
          orders.map((order) => (
            <Card
              key={order.id}
              className="p-4 bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={order.imageUrl}
                    alt={order.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">
                    {order.productName}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        Due: {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span>${order.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 whitespace-nowrap"
                  onClick={() => onReorder(order.id)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Reorder
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
