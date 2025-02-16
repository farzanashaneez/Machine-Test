import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default storage for redux-persist (localStorage in web)

const persistConfig = {
  key: "root", 
  version: 1, 
  storage, 
};


const rootReducer = combineReducers({
  appUser: userSlice, 
});


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});


export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
