import React from "react";
import { Card } from "./ui/card";
import { Clock, Package } from "lucide-react";

interface OrderHistoryItem {
  id: string;
  productName: string;
  orderDate: string;
  imageUrl: string;
  price: number;
}

interface OrderHistoryProps {
  orders?: OrderHistoryItem[];
}

const OrderHistory = ({
  orders = [
    {
      id: "1",
      productName: "Water 6 Bottles",
      orderDate: "2024-02-15",
      imageUrl: "https://images.unsplash.com/photo-1616118132534-381148898bb4",
      price: 29.99,
    },
    {
      id: "2",
      productName: "Whey Protein",
      orderDate: "2024-02-01",
      imageUrl: "https://images.unsplash.com/photo-1579722820308-d74e571900a9",
      price: 49.99,
    },
  ],
}: OrderHistoryProps) => {
  return (
    <div className="w-full min-h-[800px] bg-gray-50 p-6">
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        {orders.map((order) => (
          <Card key={order.id} className="p-4 bg-white">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>${order.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
