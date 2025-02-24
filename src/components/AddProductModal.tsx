import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import Button from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface AddProductModalProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: ProductFormData) => void;
}

interface ProductFormData {
  name: string;
  imageUrl: string;
  productUrl: string;
  price: number;
  reorderInterval: string;
  nextReorderDate: Date;
}

const AddProductModal = ({
  open = true,
  onClose = () => {},
  onSubmit = () => {},
}: AddProductModalProps) => {
  const [date, setDate] = React.useState<Date>(new Date());
  const [reorderInterval, setReorderInterval] = React.useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: ProductFormData = {
      name: (e.target as any).productName.value,
      imageUrl: (e.target as any).imageUrl.value,
      productUrl: (e.target as any).productUrl.value,
      price: parseFloat((e.target as any).price.value),
      reorderInterval: reorderInterval.toString(),
      nextReorderDate: date,
    };
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Add New Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              name="productName"
              placeholder="Enter product name"
              defaultValue="Sample Product"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Product Image</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              placeholder="Enter image URL"
              defaultValue="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productUrl">Product Link</Label>
            <Input
              id="productUrl"
              name="productUrl"
              placeholder="Enter product URL"
              defaultValue="https://www.amazon.com/sample-product"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter product price"
              defaultValue="29.99"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="reorderInterval">Reorder Interval</Label>
              <span className="text-sm text-muted-foreground">
                {reorderInterval} days
              </span>
            </div>
            <Slider
              id="reorderInterval"
              min={1}
              max={180}
              step={1}
              value={[reorderInterval]}
              onValueChange={(value) => setReorderInterval(value[0])}
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
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
