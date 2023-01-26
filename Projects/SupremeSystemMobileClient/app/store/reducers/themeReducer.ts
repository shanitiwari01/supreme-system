/**
 * Loading reducer made separate for easy blacklisting
 * Avoid data persist
 */
import { createReducer } from "./../CreateReducer";
import * as types from "./../../store/actions/types";

import { ITheme } from "./../../models/theme";

let initialState: ITheme = {
  isPortrait: true,
  height: 0,
  width: 0,
};

export const themeReducer = createReducer(initialState, {
  [types.TOGGLE_MODE](state: ITheme, action: ITheme) {
    return { ...state, isPortrait: action.isPortrait, height: action.height, width: action.width };
  },
});
