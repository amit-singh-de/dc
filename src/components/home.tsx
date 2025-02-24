import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../lib/auth";
import { generateAffiliateLink } from "../lib/utils";
import { getProducts, addProduct, updateProduct } from "../lib/products";
import DashboardHeader from "./DashboardHeader";
import ProductGrid from "./ProductGrid";
import AddProductModal from "./AddProductModal";
import EmptyState from "./EmptyState";
import OrderHistory from "./OrderHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  progress: number;
  nextReorderDate: string;
  price?: number;
}

interface OrderHistoryItem {
  id: string;
  productName: string;
  orderDate: string;
  imageUrl: string;
  price: number;
}

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          navigate("/login");
          return;
        }
        const data = await getProducts(user.id);
        setProducts(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            imageUrl: p.image_url,
            progress: p.progress,
            nextReorderDate: p.next_reorder_date,
            price: p.price,
          })),
        );
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddProduct = async (data: any) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        navigate("/login");
        return;
      }
      const newProduct = await addProduct(user.id, {
        name: data.name,
        image_url: data.imageUrl,
        next_reorder_date: data.nextReorderDate.toISOString(),
        price: 29.99,
      });

      setProducts([
        {
          id: newProduct.id,
          name: newProduct.name,
          imageUrl: newProduct.image_url,
          progress: newProduct.progress,
          nextReorderDate: newProduct.next_reorder_date,
          price: newProduct.price,
        },
        ...products,
      ]);

      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleReorder = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    // Generate and open affiliate link
    const affiliateLink = generateAffiliateLink(product.imageUrl);
    window.open(affiliateLink, "_blank");

    try {
      await updateProduct(id, { progress: 0 });

      // Add to order history
      const newOrder: OrderHistoryItem = {
        id: Date.now().toString(),
        productName: product.name,
        orderDate: new Date().toISOString(),
        imageUrl: product.imageUrl,
        price: product.price || 0,
      };
      setOrderHistory([newOrder, ...orderHistory]);

      // Update products
      setProducts(
        products.map((product) =>
          product.id === id ? { ...product, progress: 0 } : product,
        ),
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader onAddProduct={() => setIsAddModalOpen(true)} />

      <Tabs defaultValue="dashboard" className="w-full">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="history">Order History</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <TabsContent value="dashboard">
            {products.length === 0 ? (
              <div className="flex justify-center items-center min-h-[600px]">
                <EmptyState onAddProduct={() => setIsAddModalOpen(true)} />
              </div>
            ) : (
              <ProductGrid products={products} onReorder={handleReorder} />
            )}
          </TabsContent>

          <TabsContent value="history">
            <OrderHistory orders={orderHistory} />
          </TabsContent>
        </main>
      </Tabs>

      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  );
};

export default Home;
