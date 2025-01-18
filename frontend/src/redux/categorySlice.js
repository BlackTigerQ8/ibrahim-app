import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import i18next from "i18next";

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API_URL}/categories`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const initialState = {
  categories: [],
  status: "idle",
  error: null,
};

// Utility function for toast notifications
const dispatchToast = (message, type) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  });
};

// Thunk action for fetching all categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const response = await axiosInstance.get("/");
      // Filter categories to only show those created by the logged-in user
      const userCategories = response.data.data.categories.filter(
        (category) => category.createdBy === user.userInfo._id
      );

      return userCategories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk action for creating a new category
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData) => {
    try {
      const response = await axiosInstance.post(`/`, categoryData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Created Category Response:", response.data);
      return response.data.data.category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error(error.response?.data.message || error.message);
    }
  }
);

// Thunk action for updating a category
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, updatedData }) => {
    try {
      const response = await axiosInstance.patch(`/${id}`, updatedData);
      dispatchToast(i18next.t("updateCategorySuccess"), "success");
      return response.data.data.category;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

// Thunk action for deleting a category
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id) => {
    try {
      await axiosInstance.delete(`/${id}`);
      dispatchToast(i18next.t("deleteCategorySuccess"), "success");
      return id;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("fetchCategoriesError"), "error");
      })

      // Create category
      .addCase(createCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("Created category:", action.payload);
        state.categories = [...state.categories, action.payload];
        dispatchToast(i18next.t("createCategorySuccess"), "success");
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error creating category";
        dispatchToast(i18next.t("createCategoryError"), "error");
      })

      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
