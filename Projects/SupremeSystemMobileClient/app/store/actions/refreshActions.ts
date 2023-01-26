import * as types from './types';

export function setRefreshStudents(refreshStudents: boolean) {
  return {
    type: types.REFRESH_STUDENTS,
    refreshStudents: refreshStudents,
  };
}

export function setRefreshLanguages(refreshLanguages: boolean) {
  return {
    type: types.REFRESH_LANGUAGES,
    refreshLanguages: refreshLanguages,
  };
}