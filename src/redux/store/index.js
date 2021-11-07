import { createStore, combineReducers } from "redux";
import LoginReducer from "../reducers/LoginReducer";
import UserDetailsReducer from "../reducers/UserDetailReducer";

const configStore = () => {
    const store = createStore(combineReducers({
        loginStatus : LoginReducer,
        userDetails : UserDetailsReducer
    }))
    
    return store;
}

export default configStore;