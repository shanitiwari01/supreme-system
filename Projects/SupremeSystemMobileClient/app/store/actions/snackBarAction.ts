import * as types from './types';
import { SNACKBAR_TIME_OUT } from 'utility';

export function setShowSnackBar(show: boolean, message: string, timeOut: number = SNACKBAR_TIME_OUT) {
  return {
    type: types.SNACK_BAR_ENABLE,
    show: show,
    message: message,
    timeOut: timeOut
  };
}