import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import Button from "./ui/button";
import { Progress } from "./ui/progress";
import { Clock, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ProductCardProps {
  id?: string;
  name?: string;
  imageUrl?: string;
  progress?: number;
  nextReorderDate?: string;
  price?: number;
  onReorder?: (id: string) => void;
}

const ProductCard = ({
  id = "1",
  name = "Sample Product",
  imageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  progress = 75,
  nextReorderDate = "2024-05-01",
  price = 29.99,
  onReorder = () => console.log("Reorder clicked"),
}: ProductCardProps) => {
  const getDaysLeft = () => {
    const daysLeft = Math.ceil(
      (new Date(nextReorderDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return daysLeft;
  };

  const daysLeft = getDaysLeft();
  const isOverdue = progress >= 100;

  return (
    <Card className="w-full max-w-sm bg-white hover:shadow-lg transition-shadow duration-200">
      <div className="p-4 flex gap-4">
        <div className="relative h-20 w-20 flex-shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold truncate">{name}</h3>
            <span className="text-sm font-medium text-gray-600">
              ${price.toFixed(2)}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {isOverdue
                  ? `Overdue by ${Math.abs(daysLeft)} days`
                  : `Due in ${Math.abs(daysLeft)} days`}
              </span>
            </div>

            <div className="space-y-1.5">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Reorder Progress</span>
                <span>
                  {isOverdue
                    ? `Overdue by ${Math.abs(daysLeft)} days`
                    : `Due in ${Math.abs(daysLeft)} days`}
                </span>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="w-full"
                    variant={progress >= 100 ? "default" : "secondary"}
                    onClick={() => onReorder(id)}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reorder Now
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {progress >= 100
                      ? "Click to reorder this product"
                      : "Check product details"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
