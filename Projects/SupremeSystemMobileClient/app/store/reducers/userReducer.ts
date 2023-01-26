import { createReducer } from "./../CreateReducer";
import * as types from "./../../store/actions/types";
import { IUser } from "./../../models/user";

let initialState: IUser = {
  userDetail: {}
};

export const userReducer = createReducer(initialState, {
  [types.USER_DETAIL](state: IUser, action: IUser) {
    return { ...state, userDetail: action.userDetail};
  },
});