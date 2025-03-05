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

interface EditProductModalProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: ProductFormData) => void;
  product?: {
    id: string;
    name: string;
    imageUrl: string;
    productUrl: string;
    price: number;
    reorderInterval: number;
    nextReorderDate: Date;
    progress: number;
  };
}

interface ProductFormData {
  id: string;
  name: string;
  imageUrl: string;
  productUrl: string;
  price: number;
  reorderInterval: string;
  nextReorderDate: Date;
  progress: number;
}

const EditProductModal = ({
  open = false,
  onClose = () => {},
  onSubmit = () => {},
  product = {
    id: "",
    name: "",
    imageUrl: "",
    productUrl: "",
    price: 0,
    reorderInterval: 30,
    nextReorderDate: new Date(),
    progress: 0,
  },
}: EditProductModalProps) => {
  const [date, setDate] = React.useState<Date>(
    product?.nextReorderDate || new Date(),
  );
  const [reorderInterval, setReorderInterval] = React.useState(
    product?.reorderInterval || 30,
  );
  const [progress, setProgress] = React.useState(product?.progress || 0);

  React.useEffect(() => {
    if (product && product.id) {
      setDate(new Date(product.nextReorderDate));
      setReorderInterval(product.reorderInterval);
      setProgress(product.progress);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: ProductFormData = {
      id: product.id,
      name: (e.target as any).productName.value,
      imageUrl: (e.target as any).imageUrl.value,
      productUrl: (e.target as any).productUrl.value,
      price: parseFloat((e.target as any).price.value),
      reorderInterval: reorderInterval.toString(),
      nextReorderDate: date,
      progress: progress,
    };
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[600px] bg-card overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Edit Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              name="productName"
              placeholder="Enter product name"
              defaultValue={product.name}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Product Image</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              placeholder="Enter image URL"
              defaultValue={product.imageUrl}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productUrl">Product Link</Label>
            <Input
              id="productUrl"
              name="productUrl"
              placeholder="Enter product URL"
              defaultValue={product.productUrl}
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
              defaultValue={product.price}
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
            <div className="flex justify-between">
              <Label htmlFor="progress">Progress</Label>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Slider
              id="progress"
              min={0}
              max={100}
              step={1}
              value={[progress]}
              onValueChange={(value) => setProgress(value[0])}
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
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
