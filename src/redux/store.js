import { createStore } from "redux";
import { combineReducer } from "./combineReducer";

const store = createStore(combineReducer);

export default store;
