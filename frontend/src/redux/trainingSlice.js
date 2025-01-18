import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import i18next from "i18next";

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API_URL}/trainings`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const initialState = {
  trainings: [],
  status: "idle",
  error: null,
};

const dispatchToast = (message, type) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  });
};

export const fetchTrainings = createAsyncThunk(
  "training/fetchTrainings",
  async ({ categoryId }) => {
    try {
      const response = await axiosInstance.get(`/`, {
        params: { categoryId },
      });
      return response.data.data.trainings;
    } catch (error) {
      console.error(error);
      throw new Error(error.response?.data.message || error.message);
    }
  }
);

export const createTraining = createAsyncThunk(
  "training/createTraining",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data.training;
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      dispatchToast(
        error.response?.data?.message || i18next.t("errorCreatingTraining"),
        "error"
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTraining = createAsyncThunk(
  "training/updateTraining",
  async ({ trainingId, trainingData }) => {
    try {
      const response = await axiosInstance.patch(
        `/${trainingId}`,
        trainingData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data.training;
    } catch (error) {
      console.error(error);
      throw new Error(error.response?.data.message || error.message);
    }
  }
);

export const deleteTraining = createAsyncThunk(
  "training/deleteTraining",
  async (trainingId) => {
    try {
      await axiosInstance.delete(`/${trainingId}`);
      return trainingId;
    } catch (error) {
      console.error(error);
      throw new Error(error.response?.data.message || error.message);
    }
  }
);

const trainingsSlice = createSlice({
  name: "trainings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrainings.fulfilled, (state, action) => {
        state.trainings = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTrainings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Create training
      .addCase(createTraining.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTraining.fulfilled, (state, action) => {
        state.trainings = [...state.trainings, action.payload];
        state.status = "succeeded";
        dispatchToast(i18next.t("createTrainingSuccess"), "success");
      })
      .addCase(createTraining.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("createTrainingError"), "error");
      })

      // Update training
      .addCase(updateTraining.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTraining.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.trainings.findIndex(
          (training) => training._id === action.payload._id
        );
        if (index !== -1) {
          state.trainings[index] = action.payload;
        }
        dispatchToast(i18next.t("updateTrainingSuccess"), "success");
      })
      .addCase(updateTraining.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("updateTrainingError"), "error");
      })

      // Delete Training
      .addCase(deleteTraining.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTraining.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trainings = state.trainings.filter(
          (training) => training._id !== action.payload
        );
        dispatchToast(i18next.t("deleteTrainingSuccess"), "success");
      })
      .addCase(deleteTraining.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("deleteTrainingError"), "error");
      });
  },
});

export default trainingsSlice.reducer;
