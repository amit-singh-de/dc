import { supabase } from "./supabase";

export const getProducts = async (userId: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const addProduct = async (
  userId: string,
  product: {
    name: string;
    image_url: string;
    product_url: string;
    next_reorder_date: string;
    price?: number;
  },
) => {
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        user_id: userId,
        name: product.name,
        image_url: product.image_url,
        product_url: product.product_url,
        next_reorder_date: product.next_reorder_date,
        price: product.price || 29.99,
        progress: 0,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (productId: string, updates: any) => {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
