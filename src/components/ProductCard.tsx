import React from "react";
import { Card } from "./ui/card";
import Button from "./ui/button";
import { Progress } from "./ui/progress";
import { Clock, RefreshCw, Pencil, Truck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface ProductCardProps {
  id?: string;
  name?: string;
  imageUrl?: string;
  productUrl?: string;
  progress?: number;
  nextReorderDate?: string;
  price?: number;
  deliveryTime?: number;
  onReorder?: (id: string) => void;
  onEditName?: (id: string, newName: string) => void;
}

const ProductCard = ({
  id = "1",
  name = "Sample Product",
  imageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  productUrl = "https://www.amazon.com/sample-product",
  progress = 75,
  nextReorderDate = "2024-05-01",
  price = 29.99,
  deliveryTime = 3,
  onReorder = () => console.log("Reorder clicked"),
  onEditName = () => console.log("Edit name clicked"),
}: ProductCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editedName, setEditedName] = React.useState(name);
  const [editedUrl, setEditedUrl] = React.useState(productUrl);
  const [editedPrice, setEditedPrice] = React.useState(price.toString());
  const [editedReorderInterval, setEditedReorderInterval] = React.useState(30);
  const [editedDeliveryTime, setEditedDeliveryTime] =
    React.useState(deliveryTime);
  const [editedDate, setEditedDate] = React.useState<Date>(
    new Date(nextReorderDate),
  );
  const getDaysLeft = () => {
    const daysLeft = Math.ceil(
      (new Date(nextReorderDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return daysLeft;
  };

  const daysLeft = getDaysLeft();
  const isOverdue = progress >= 100;

  const handleSaveChanges = () => {
    if (editedName !== name) {
      onEditName(id, editedName);
    }
    // Here you would also handle URL, price, and reorder interval changes
    // by adding similar functions to your component props
    // For example:
    // if (editedUrl !== productUrl) {
    //   onEditUrl(id, editedUrl);
    // }
    // if (parseFloat(editedPrice) !== price) {
    //   onEditPrice(id, parseFloat(editedPrice));
    // }
    // if (editedReorderInterval !== reorderInterval) {
    //   onEditReorderInterval(id, editedReorderInterval);
    // }
    setIsEditModalOpen(false);
  };

  return (
    <>
      <Card className="w-full max-w-full sm:max-w-sm bg-card hover:shadow-lg transition-shadow duration-200 border-border relative">
        <div className="absolute top-2 right-2 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit product</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

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
              <span className="text-sm font-medium text-muted-foreground mr-8">
                ${price.toFixed(2)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {isOverdue
                    ? `Overdue by ${Math.abs(daysLeft)} days`
                    : `Due in ${Math.abs(daysLeft)} days`}
                </span>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Truck className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  Estimated Delivery: {deliveryTime}{" "}
                  {deliveryTime === 1 ? "day" : "days"}
                </span>
              </div>

              <div className="space-y-1.5">
                <Progress
                  value={progress}
                  className="h-3 bg-indigo-100 dark:bg-indigo-950"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Reorder Progress</span>
                  <span>{progress}%</span>
                </div>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="w-full"
                      variant={progress >= 100 ? "default" : "secondary"}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(productUrl, "_blank");
                        if (onReorder) onReorder(id);
                      }}
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[600px] bg-card overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Edit Product
            </DialogTitle>
          </DialogHeader>

          <form className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productUrl">Product Link</Label>
              <Input
                id="productUrl"
                value={editedUrl}
                onChange={(e) => setEditedUrl(e.target.value)}
                placeholder="Enter product URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                placeholder="Enter product price"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="reorderInterval">Reorder Interval</Label>
                <span className="text-sm text-muted-foreground">
                  {editedReorderInterval} days
                </span>
              </div>
              <Slider
                id="reorderInterval"
                min={1}
                max={180}
                step={1}
                value={[editedReorderInterval]}
                onValueChange={(value) => setEditedReorderInterval(value[0])}
                className="py-2"
              />
            </div>

            <div className="space-y-2">
              <Label>Next Reorder Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedDate ? (
                      format(editedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editedDate}
                    onSelect={(newDate) => newDate && setEditedDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
