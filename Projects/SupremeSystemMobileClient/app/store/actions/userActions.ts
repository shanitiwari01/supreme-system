import * as types from './types';
import { UserModel } from 'datamodels';

export function setUser(userDetail: UserModel) {
  return {
    type: types.USER_DETAIL,
    userDetail: userDetail
  };
}