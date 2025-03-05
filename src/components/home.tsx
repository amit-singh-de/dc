import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../lib/auth";
import { generateAffiliateLink } from "../lib/utils";
import {
  getProducts,
  getOrderHistory,
  addProduct,
  updateProduct,
} from "../lib/products";
import DashboardHeader from "./DashboardHeader";
import ProductGrid from "./ProductGrid";
import AddProductModal from "./AddProductModal";
// import EditProductModal from "./EditProductModal";
import EmptyState from "./EmptyState";
import OrderHistory from "./OrderHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  productUrl: string;
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
  const [historyLoading, setHistoryLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<
    Array<{ id: string; productName: string; daysLeft: number }>
  >([]);

  const checkNotifications = (products: Product[]) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const notifications = products
      .filter((product) => {
        const reorderDate = new Date(product.nextReorderDate);
        reorderDate.setHours(0, 0, 0, 0);
        const daysLeft = Math.ceil(
          (reorderDate.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        );
        return daysLeft <= 3; // Show notifications for products due in 3 days or less
      })
      .map((product) => ({
        id: product.id,
        productName: product.name,
        daysLeft: Math.ceil(
          (new Date(product.nextReorderDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      }));

    setNotifications(notifications);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          navigate("/login");
          return;
        }

        // Load products
        const productData = await getProducts(user.id);
        const mappedProducts = productData.map((p) => ({
          id: p.id,
          name: p.name,
          imageUrl: p.image_url,
          productUrl: p.product_url,
          progress: p.progress,
          nextReorderDate: p.next_reorder_date,
          price: p.price,
        }));
        setProducts(mappedProducts);
        checkNotifications(mappedProducts);

        // Load order history
        const historyData = await getOrderHistory(user.id);
        const mappedHistory = historyData.map((p) => ({
          id: p.id,
          productName: p.name,
          orderDate: p.next_reorder_date,
          imageUrl: p.image_url,
          price: p.price || 0,
          productUrl: p.product_url,
        }));
        setOrderHistory(mappedHistory);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
        setHistoryLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEditProductName = async (id: string, newName: string) => {
    try {
      await updateProduct(id, { name: newName });

      // Update products state
      setProducts(
        products.map((p) => (p.id === id ? { ...p, name: newName } : p)),
      );

      // Update notifications if needed
      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, productName: newName } : n,
        ),
      );
    } catch (error) {
      console.error("Error updating product name:", error);
    }
  };

  const handleEditProductUrl = async (id: string, newUrl: string) => {
    try {
      await updateProduct(id, { product_url: newUrl });
      setProducts(
        products.map((p) => (p.id === id ? { ...p, productUrl: newUrl } : p)),
      );
    } catch (error) {
      console.error("Error updating product URL:", error);
    }
  };

  const handleEditProductPrice = async (id: string, newPrice: number) => {
    try {
      await updateProduct(id, { price: newPrice });
      setProducts(
        products.map((p) => (p.id === id ? { ...p, price: newPrice } : p)),
      );
    } catch (error) {
      console.error("Error updating product price:", error);
    }
  };

  const handleEditReorderInterval = async (id: string, newInterval: number) => {
    try {
      await updateProduct(id, { reorder_interval: newInterval });
      // You would need to update the product in the state, but since reorderInterval
      // isn't directly stored in the product state, you might need to adjust this
      console.log(
        `Updated reorder interval for product ${id} to ${newInterval} days`,
      );
    } catch (error) {
      console.error("Error updating reorder interval:", error);
    }
  };

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
        product_url: data.productUrl,
        next_reorder_date: data.nextReorderDate.toISOString(),
        price: data.price,
      });

      setProducts([
        {
          id: newProduct.id,
          name: newProduct.name,
          imageUrl: newProduct.image_url,
          productUrl: newProduct.product_url,
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
    const affiliateLink = generateAffiliateLink(product.productUrl);
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
        products.map((p) => (p.id === id ? { ...p, progress: 0 } : p)),
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onAddProduct={() => setIsAddModalOpen(true)}
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <Tabs defaultValue="dashboard" className="w-full">
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <TabsList className="w-full">
              <TabsTrigger value="dashboard" className="flex-1">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1">
                Order History
              </TabsTrigger>
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
              <ProductGrid
                products={products}
                onReorder={(id) => {
                  console.log("Reorder clicked:", id);
                  handleReorder(id);
                }}
                onEditName={handleEditProductName}
              />
            )}
          </TabsContent>

          <TabsContent value="history">
            <OrderHistory
              orders={orderHistory}
              isLoading={historyLoading}
              onReorder={handleReorder}
            />
          </TabsContent>
        </main>
      </Tabs>

      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
      />

      {/* Edit modal removed */}
    </div>
  );
};

export default Home;
