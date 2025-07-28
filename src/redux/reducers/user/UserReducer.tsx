import { createSlice } from "@reduxjs/toolkit";
import { IUserState } from "../../../utils/types";

const initialState: IUserState = {
  userData: null,
  token: null,
  selectedLanguage: null,
  isOnboard: false,
  fcmToken: null,
  isOnline: false,
  driverId: null,
  userType:"buyer",
  rideId: '',
};

const UserReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserData: (state, action) => {
      state.userData = action.payload;
    },
    saveUserType: (state, action) => {
      state.userType = action.payload;
    },
    removeUserType: (state, action) => {
      state.userType = null;
    },
    removeUserData: (state) => {
      state.userData = null;
      state.token = null;
    },
    setAuthToken: (state, action) => {
      state.token = action.payload;
    },
    removeToken: (state) => {
      state.token = null;
    },
    saveLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    setIsOnboard: (state, action) => {
      state.isOnboard = action.payload;
    },
    storeDeviceFCMToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    saveFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    setOnline: (state, action) => {
      state.isOnline = action.payload;
    },
    setDriverId: (state, action) => {
      state.driverId = action.payload;
    },
    ride_Id: (state, action) => {
      state.rideId = action.payload;
    },
    RemoveRide_Id: state => {
      state.rideId = null;
    },
  },
});

export const {
  saveUserData,
  saveUserType,
  removeUserData,
  removeUserType,
  setAuthToken,
  removeToken,
  saveLanguage,
  setIsOnboard,
  storeDeviceFCMToken,
  saveFcmToken,
  setOnline,
  setDriverId,
  ride_Id,
  RemoveRide_Id
} = UserReducer.actions;

export default UserReducer.reducer;
