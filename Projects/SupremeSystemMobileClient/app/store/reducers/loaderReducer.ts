import { createReducer } from "./../CreateReducer";
import * as types from "../actions/types";
import { ILoader } from "app/models/loader";

let initialState: ILoader = {
   loading: false
};

export const loaderReducer = createReducer(initialState, {
  [types.LOADING_ENABLE](state: ILoader, action: ILoader) {
    return { ...state, loading: action.loading};
  },
});