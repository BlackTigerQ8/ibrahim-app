import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import i18next from "i18next";

const API_URL = process.env.REACT_APP_API_URL;

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
  async (token) => {
    try {
      const response = await axios.get(`${API_URL}/trainings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data); // Log the API response to ensure it's correct
      return response.data;
    } catch (error) {
      console.error(error); // Log error details
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
      });
  },
});

export default trainingsSlice.reducer;
