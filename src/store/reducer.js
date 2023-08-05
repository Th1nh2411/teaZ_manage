import { SET_DETAIL_ITEM, SET_TOAST, SET_USER_INFO } from './constraints';

function reducer(state, action) {
    switch (action.type) {
        case SET_USER_INFO:
            return { ...state, userInfo: action.payload };

        case SET_DETAIL_ITEM:
            return { ...state, detailItem: action.payload };

        case SET_TOAST:
            return { ...state, toast: action.payload };

        default:
            return state;
    }
}
export default reducer;
