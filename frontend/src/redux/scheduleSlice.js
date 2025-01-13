import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import i18next from "i18next";

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API_URL}/schedules`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const initialState = {
  schedules: [],
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

export const fetchSchedules = createAsyncThunk(
  "schedules/fetchSchedules",
  async () => {
    try {
      const response = await axiosInstance.get("/");
      return response.data.data.schedules;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    }
  }
);

export const createSchedule = createAsyncThunk(
  "schedules/createSchedule",
  async (scheduleData) => {
    try {
      const response = await axiosInstance.post("/", scheduleData);
      return response.data.data.schedule;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    }
  }
);

export const updateSchedule = createAsyncThunk(
  "schedules/updateSchedule",
  async ({ id, scheduleData }) => {
    try {
      const response = await axiosInstance.patch(`/${id}`, scheduleData);
      return response.data.data.schedule;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    }
  }
);

export const updateScheduleStatus = createAsyncThunk(
  "schedules/updateScheduleStatus",
  async ({ id, status }) => {
    try {
      // Update the endpoint to use the new status-specific route
      const response = await axiosInstance.patch(`/${id}/status`, { status });
      return response.data.data.schedule;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    }
  }
);

export const deleteSchedule = createAsyncThunk(
  "schedules/deleteSchedule",
  async (id) => {
    try {
      await axiosInstance.delete(`/${id}`);
      return id;
    } catch (error) {
      throw new Error(error.response?.data.message || error.message);
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch schedules
      .addCase(fetchSchedules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("fetchSchedulesError"), "error");
      })
      // Create schedule
      .addCase(createSchedule.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.schedules.push(action.payload);
        dispatchToast(i18next.t("createScheduleSuccess"), "success");
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("createScheduleError"), "error");
      })
      // Update schedule
      .addCase(updateSchedule.fulfilled, (state, action) => {
        const index = state.schedules.findIndex(
          (schedule) => schedule._id === action.payload._id
        );
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
        dispatchToast(i18next.t("updateScheduleSuccess"), "success");
      })
      // Delete schedule
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter(
          (schedule) => schedule._id !== action.payload
        );
        dispatchToast(i18next.t("deleteScheduleSuccess"), "success");
      })
      // Update Schedule Status
      .addCase(updateScheduleStatus.fulfilled, (state, action) => {
        const index = state.schedules.findIndex(
          (schedule) => schedule._id === action.payload._id
        );
        if (index !== -1) {
          state.schedules[index].status = action.payload.status;
        }
      });
  },
});

export default scheduleSlice.reducer;
