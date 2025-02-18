export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  image_url: string;
  reorder_interval: number;
  next_reorder_date: string;
  progress: number;
  created_at: string;
  updated_at: string;
}
