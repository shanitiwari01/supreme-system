import { createReducer } from "./../CreateReducer";
import * as types from "./../../store/actions/types";
import { SNACKBAR_TIME_OUT } from "utility";
import { ISnackBar } from "./../../models/snackBar";

let initialState: ISnackBar = {
    message:"",
    show: false,
    timeOut: SNACKBAR_TIME_OUT
};

export const snackBarReducer = createReducer(initialState, {
  [types.SNACK_BAR_ENABLE](state: ISnackBar, action: ISnackBar) {
    return { ...state, show: action.show, message: action.message, timeOut: action.timeOut};
  },
});