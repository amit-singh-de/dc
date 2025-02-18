import { supabase, mockData } from "./supabase";
import { Product } from "../types/database";

async function extractImageFromLink(url: string): Promise<string> {
  try {
    // If it's already an image URL, return it
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return url;
    }

    // For Amazon links
    if (url.includes("amazon.com")) {
      const match = url.match(/\/([A-Z0-9]{10})(?:\/|\/ref|$)/);
      if (match) {
        return `https://images-na.ssl-images-amazon.com/images/P/${match[1]}.01.L.jpg`;
      }
    }

    // For other URLs, return a default image
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30";
  } catch (error) {
    console.error("Error extracting image:", error);
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30";
  }
}

export const getProducts = async (userId: string) => {
  const { data, error } = await (supabase || mockData)
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Product[];
};

export const addProduct = async (
  userId: string,
  product: Omit<Product, "id" | "user_id" | "created_at" | "updated_at">,
) => {
  // Extract image URL from product link
  const imageUrl = await extractImageFromLink(product.image_url);

  const { data, error } = await (supabase || mockData)
    .from("products")
    .insert([
      {
        user_id: userId,
        ...product,
        image_url: imageUrl,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Product;
};

export const updateProduct = async (
  productId: string,
  updates: Partial<Product>,
) => {
  const { data, error } = await (supabase || mockData)
    .from("products")
    .update(updates)
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
};
