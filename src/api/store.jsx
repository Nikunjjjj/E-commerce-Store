import { configureStore } from "@reduxjs/toolkit";
import { fakeStoreApi } from "./BaseUrl";

const store = configureStore({
  reducer: {
    [fakeStoreApi.reducerPath]: fakeStoreApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fakeStoreApi.middleware),
});

export default store;
