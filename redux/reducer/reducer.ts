import { combineReducers } from "redux";
import SidenavReducer from "./sidenavreducer";
import AuthReducer from "./authreducer";


const reducer = combineReducers({
    sidenav: SidenavReducer,
    auth: AuthReducer
});

export default reducer;
