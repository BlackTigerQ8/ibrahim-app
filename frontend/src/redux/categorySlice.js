import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import i18next from "i18next";

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API_URL}/schedules`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
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
  "schedules/fetchCategories",
  async () => {
    try {
      const response = await axiosInstance.get("/");
      return response.data.data.categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

// Thunk action for creating a new category
export const createCategory = createAsyncThunk(
  "schedules/createCategory",
  async (categoryData) => {
    try {
      const response = await axiosInstance.post("/", categoryData);
      dispatchToast(i18next.t("createCategorySuccess"), "success");
      return response.data.data.category;
    } catch (error) {
      dispatchToast(i18next.t("createCategoryError"), "error");
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

// Thunk action for updating a category
export const updateCategory = createAsyncThunk(
  "schedules/updateCategory",
  async ({ id, updatedData }) => {
    try {
      const response = await axiosInstance.put(`/${id}`, updatedData);
      dispatchToast(i18next.t("updateCategorySuccess"), "success");
      return response.data.data.category;
    } catch (error) {
      dispatchToast(i18next.t("updateCategoryError"), "error");
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

// Thunk action for deleting a category
export const deleteCategory = createAsyncThunk(
  "schedules/deleteCategory",
  async (id) => {
    try {
      await axiosInstance.delete(`/${id}`);
      dispatchToast(i18next.t("deleteCategorySuccess"), "success");
      return id;
    } catch (error) {
      dispatchToast(i18next.t("deleteCategoryError"), "error");
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
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
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
