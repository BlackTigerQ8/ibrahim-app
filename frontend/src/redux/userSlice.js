import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import i18next from "i18next";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
  userInfo: null,
  status: "",
  token: "",
  userRole: "",
};

const dispatchToast = (message, type) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    style:
      type === "error"
        ? {
            backgroundColor: "#FFF1F0",
            color: "#FF4D4F",
            borderLeft: "4px solid #FF4D4F",
          }
        : undefined,
  });
};

// Thunk action for user registration
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userFormData) => {
    try {
      // Inside the code where you make API requests
      const response = await axios.post(`${API_URL}/users`, userFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || error.message);
    }
  }
);

// Thunk action for user login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      return response.data;
    } catch (error) {
      if (error.response.status === 401) {
        // Clear local storage if unauthorized
        localStorage.clear();
      }
      throw new Error(error.response.data.message || error.message);
    }
  }
);

// Thunk action for profile image upload
export const profileImage = createAsyncThunk(
  "user/profileImage",
  async (imageFile) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", imageFile);
    try {
      const response = await axios.post(`${API_URL}/upload/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.userInfo = action.payload;
      state.userRole = action.payload.user.role;
    },
    logoutUser(state) {
      state.userInfo = null;
      state.userRole = "";
      state.token = "";
      state.status = "";
      dispatchToast(i18next.t("loggedOut"), "success");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { user, token } = action.payload.data;
        state.userInfo = user;
        state.token = token;
        state.token = action.payload.token;
        state.userRole = user.role;
        localStorage.setItem("token", action.payload.token);
        dispatchToast(i18next.t("loginUserFulfilled"), "success");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        dispatchToast(i18next.t("loggingIn"), "success");
      })

      ///////////////////
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        dispatchToast(i18next.t("registerUserFulfilled"), "success");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("registerUserRejected"), "error");
      })
      .addCase(profileImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userProfileImage = action.payload.file;
        dispatchToast(i18next.t("profileImageFulfilled"), "success");
      })
      .addCase(profileImage.rejected, (state) => {
        state.status = "failed";
        dispatchToast(i18next.t("profileImageRejected"), "error");
      });
  },
});

export const { logoutUser, setUser } = userSlice.actions;
export default userSlice.reducer;
