import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://midlink-of4r.onrender.com/api/doctors";

export const getDoctorProfile = createAsyncThunk(
  "doctor/getDoctorProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch profile" },
      );
    }
  },
);

export const updateDoctorProfile = createAsyncThunk(
  "doctor/updateDoctorProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/profile`, profileData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update profile" },
      );
    }
  },
);

export const updateDoctorProfileImage = createAsyncThunk(
  "doctor/updateDoctorProfileImage",
  async (imageFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", imageFile);
      const response = await axios.put(
        `${API_BASE_URL}/profile-image`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update profile image" },
      );
    }
  },
);

// Thunk جديد لتحديث الـ CV
export const updateDoctorCV = createAsyncThunk(
  "doctor/updateDoctorCV",
  async (cvFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("cv", cvFile);
      const response = await axios.put(`${API_BASE_URL}/cv`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update CV" },
      );
    }
  },
);

const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    profile: null,
    error: null,
    loading: false,
    cvLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getDoctorProfile
      .addCase(getDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch profile";
      })
      // updateDoctorProfile
      .addCase(updateDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update profile";
      })
      // updateDoctorProfileImage
      .addCase(updateDoctorProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = {
          ...state.profile,
          profile_image: action.payload.profile_image,
        };
      })
      .addCase(updateDoctorProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update profile image";
      })
      // updateDoctorCV
      .addCase(updateDoctorCV.pending, (state) => {
        state.cvLoading = true;
        state.error = null;
      })
      .addCase(updateDoctorCV.fulfilled, (state, action) => {
        state.cvLoading = false;
        state.profile = { ...state.profile, cv: action.payload.cv };
      })
      .addCase(updateDoctorCV.rejected, (state, action) => {
        state.cvLoading = false;
        state.error = action.payload?.message || "Failed to update CV";
      });
  },
});

export default doctorSlice.reducer;
