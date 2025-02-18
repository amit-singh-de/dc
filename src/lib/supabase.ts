import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found. Using mock data.");
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Mock functions for development
export const mockAuth = {
  signInWithPassword: async () => ({
    data: { user: { id: "mock-user-id", email: "demo@example.com" } },
    error: null,
  }),
  signOut: async () => ({ error: null }),
  getUser: async () => ({
    data: { user: { id: "mock-user-id", email: "demo@example.com" } },
  }),
};

export const mockData = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          data: [],
          error: null,
        }),
      }),
    }),
    insert: () => ({
      select: () => ({
        single: () => ({
          data: { id: "mock-product-id" },
          error: null,
        }),
      }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => ({
            data: { id: "mock-product-id" },
            error: null,
          }),
        }),
      }),
    }),
  }),
};
