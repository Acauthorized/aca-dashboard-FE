import { createSlice } from "@reduxjs/toolkit";

export const customertSlice = createSlice({
  name: "customer",
  initialState: {
    allcustomers: [],
    count: 0,

    isFetching: false,
    error: false,
    refetch: false,
    open: false,
    customerdata: {},
  },
  reducers: {
    fetchStart: (state) => {
      state.isFetching = true;
    },
    fetchSuccess: (state, action) => {
      console.log("ACTION ", action.payload);
      state.allcustomers = action.payload.customers;
      state.count = action.payload.count;
      state.isFetching = false;
      state.error = false;
      state.refetch = !state.refetch;
    },
    fetchFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    AddNewCustomer: (state) => {
      state.refetch = !refetch;
    },

    openCustomerModel: (state, action) => {
      state.customerdata = action.payload;

      state.open = true;
    },

    closeCustomerModel: (state, action) => {
     state.customerdata = {};

      state.open = false;
    },

    // logoutSuccess: (state) => {
    //     state.agent.currentUser = null;
    // },
  },
});

export const {
  fetchStart,
  fetchFailed,
  AddNewCustomer,
  fetchSuccess,
  closeCustomerModel,
  openCustomerModel,
} = customertSlice.actions;
export default customertSlice.reducer;
