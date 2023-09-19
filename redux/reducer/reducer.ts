import { combineReducers } from "redux";
import SidenavReducer from "./sidenavreducer";
import AuthReducer from "./authreducer";
import CartReducer from "./cartreducer";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootConfig = {
  key: "root",
  storage: storage,
};

const cartConfig = {
  key: "cart",
  storage: storage,
  whitelist: ["items"],
};

const authConfig = {
  key: "auth",
  storage: storage,
  whitelist: ["token", "user"],
};

const reducer = combineReducers({
  cart: persistReducer(cartConfig, CartReducer),
  sidenav: SidenavReducer,
  auth: persistReducer(authConfig, AuthReducer),
});

export default persistReducer(rootConfig, reducer);
