import React from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  productUrl: string;
  progress: number;
  nextReorderDate: string;
  price?: number;
}

interface ProductGridProps {
  products?: Product[];
  onReorder?: (id: string) => void;
}

const ProductGrid = ({
  products = [
    {
      id: "1",
      name: "Water 6 Bottles",
      imageUrl: "https://images.unsplash.com/photo-1616118132534-381148898bb4",
      productUrl: "https://www.amazon.com/sample-water",
      progress: 100,
      nextReorderDate: "2024-04-15",
      price: 29.99,
    },
    {
      id: "2",
      name: "Whey Protein",
      imageUrl: "https://images.unsplash.com/photo-1579722820308-d74e571900a9",
      productUrl: "https://www.amazon.com/sample-protein",
      progress: 75,
      nextReorderDate: "2024-05-01",
      price: 49.99,
    },
    {
      id: "3",
      name: "Toothpaste",
      imageUrl: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c",
      productUrl: "https://www.amazon.com/sample-toothpaste",
      progress: 45,
      nextReorderDate: "2024-05-15",
      price: 19.99,
    },
  ],
  onReorder,
}: ProductGridProps) => {
  return (
    <div className="w-full min-h-[800px] bg-background p-4 md:p-6">
      <div className="flex flex-col gap-6 max-w-sm mx-auto">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            productUrl={product.productUrl}
            progress={product.progress}
            nextReorderDate={product.nextReorderDate}
            onReorder={onReorder}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
