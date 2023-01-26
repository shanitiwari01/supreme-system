/*
 * combines all th existing reducers
 */
import * as themeReducer from './themeReducer';
import * as snackBarReducer from './snackBarReducer';
import * as loaderReducer from './loaderReducer';
import * as refreshReducer from './refreshReducer';
import * as userReducer from './userReducer';

export default Object.assign(themeReducer, snackBarReducer, loaderReducer, refreshReducer, userReducer);
