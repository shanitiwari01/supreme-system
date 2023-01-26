/*
 * Reducer actions related with login
 */
import * as types from './types';

export function setIsPortrait(isPortrait: boolean, height: number, width: number) {
  return {
    type: types.TOGGLE_MODE,
    isPortrait: isPortrait,
    height: height,
    width: width,
  };
}
