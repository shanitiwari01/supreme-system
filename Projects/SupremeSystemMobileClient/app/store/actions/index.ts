// export action creators
import * as themeActions from './themeActions';
import * as snackBarAction from './snackBarAction'
import * as loaderActions from './loaderActions';
import * as refreshAction from './refreshActions';

export const ActionCreators = Object.assign(
  {},
  themeActions,
  snackBarAction,
  loaderActions,
  refreshAction
);
