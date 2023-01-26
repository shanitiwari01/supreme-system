import { IRefresh } from "app/models/refresh";
import { createReducer } from "./../CreateReducer";
import * as types from "../actions/types";

let initialState: IRefresh = {
  refreshStudents: false,
  refreshLanguages: false
};

export const refreshReducer = createReducer(initialState, {
  [types.REFRESH_STUDENTS](state: IRefresh, action: IRefresh) {
    return { ...state, refreshStudents: action.refreshStudents};
  },
  [types.REFRESH_LANGUAGES](state: IRefresh, action: IRefresh) {
    return { ...state, refreshLanguages: action.refreshLanguages};
  },
});