import * as types from './types';

export function setLoader(loading: boolean) {
  return {
    type: types.LOADING_ENABLE,
    loading: loading
  };
}