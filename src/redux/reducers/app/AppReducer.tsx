import {createSlice} from '@reduxjs/toolkit';

interface IUserState {
  isLoading: boolean;
}
// user redusre store user data and all types of token
const initialState: IUserState = {
  isLoading: false,
};

const AppReducer = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {setLoader} = AppReducer.actions;

export default AppReducer.reducer;
