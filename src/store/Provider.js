import { useEffect, useReducer } from 'react';
import UserContext from './Context';
import reducer from './reducer';
import { actions } from '.';
import Cookies from 'js-cookie';

function Provider({ children }) {
    const initState = {
        userInfo: JSON.parse(Cookies.get('userInfo') || null),
        detailItem: { show: false, data: null, editing: false },
        toast: { show: false, content: '', title: '' },
    };
    const [state, dispatch] = useReducer(reducer, initState);

    return <UserContext.Provider value={[state, dispatch]}>{children}</UserContext.Provider>;
}

export default Provider;
