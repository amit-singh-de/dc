import React from "react";
import Button from "./ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyStateProps {
  onAddProduct?: () => void;
  title?: string;
  description?: string;
}

const EmptyState = ({
  onAddProduct = () => console.log("Add product clicked"),
  title = "No products added yet",
  description = "Start tracking your products by adding your first item.",
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] w-[600px] p-8 bg-card rounded-lg shadow-sm border border-border">
      <div className="w-16 h-16 mb-6 text-gray-400">
        <PlusCircle className="w-full h-full" />
      </div>

      <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h3>

      <p className="text-gray-500 text-center mb-8 max-w-sm">{description}</p>

      <Button
        size="lg"
        onClick={onAddProduct}
        className="flex items-center gap-2"
      >
        <PlusCircle className="w-5 h-5" />
        Add Your First Product
      </Button>
    </div>
  );
};

export default EmptyState;
