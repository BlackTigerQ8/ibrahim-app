import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import i18next from "i18next";

const API_URL = process.env.REACT_APP_API_URL;

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
  async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("API Response:", response);
      console.log("Categories Data:", response.data.data.categories);
      return response.data.data.categories;
    } catch (error) {
      console.error("Error fetching categories:", error); // Log any error
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

// Thunk action for creating a new category
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/categories`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
  "categories/updateCategory",
  async ({ id, updatedData }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/categories/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
  "categories/deleteCategory",
  async (id) => {
    try {
      await axios.delete(`${API_URL}/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
