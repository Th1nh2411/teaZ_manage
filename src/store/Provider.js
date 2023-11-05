import { useEffect, useReducer } from 'react';
import UserContext from './Context';
import reducer from './reducer';
import { actions } from '.';
import Cookies from 'js-cookie';
import { notification } from 'antd';

function Provider({ children }) {
    const [api, contextHolder] = notification.useNotification();
    const showToast = (message = '', description = '', type = 'success') => {
        api[type]({
            message,
            description,
            placement: 'bottomLeft',
        });
    };
    const initState = {
        userInfo: JSON.parse(Cookies.get('userInfo') || null),
        detailItem: { show: false, data: null, editing: false },
        showToast,
    };
    const [state, dispatch] = useReducer(reducer, initState);
    console.log(state);
    return (
        <UserContext.Provider value={[state, dispatch]}>
            {contextHolder}
            {children}
        </UserContext.Provider>
    );
}

export default Provider;
