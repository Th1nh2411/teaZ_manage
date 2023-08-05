import { SET_DETAIL_ITEM, SET_TOAST, SET_USER_INFO } from './constraints';
export const setUserInfo = (payload) => ({ type: SET_USER_INFO, payload });
export const setDetailItem = (payload) => ({ type: SET_DETAIL_ITEM, payload });
export const setToast = (payload) => ({ type: SET_TOAST, payload });
