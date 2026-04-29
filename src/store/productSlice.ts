import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Aapka existing Interface (Thoda update kiya API mapping ke liye)
export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compareAt?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  bestseller: boolean;
  details: string[];
  stock: number;
}

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

// API Fetch Thunk
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/products`);
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();
  
  // API data ko aapke Product interface mein map karna
  return data.map((apiItem: any) => ({
    id: apiItem.id.toString(),
    name: apiItem.title,
    tagline: apiItem.tagline || "Quality Product",
    description: apiItem.description,
    price: apiItem.price,
    image: `${import.meta.env.VITE_API_BASE_URL}${apiItem.productImage}`, // API image field
    category: "General", // API mein category nahi hai toh default de rahe hain
    rating: apiItem.rating || 0,
    reviews: apiItem.reviews || 0,
    bestseller: Boolean(apiItem.bestseller),
    details: [apiItem.color ? `Color: ${apiItem.color}` : ""].filter(Boolean),
    stock: apiItem.stock,
  }));
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default productSlice.reducer;