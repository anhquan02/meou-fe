import { createStore } from "redux";
import rootReducer  from "./reducer/reducer";
import {configureStore} from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: "root",
  storage: storage,
};

const pReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: pReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk]
});
// export const store = createStore(pReducer);
// export const persistor = persistStore(store);
export default store;

