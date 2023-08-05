import { useEffect, useReducer } from 'react';
import UserContext from './Context';
import reducer from './reducer';
import { actions } from '.';
import LocalStorageManager from '../utils/LocalStorageManager';

function Provider({ children }) {
    const localStorageManager = LocalStorageManager.getInstance();

    const initState = {
        userInfo: null,
        detailItem: { show: false, data: null, editing: false },
        toast: { show: false, content: '', title: '' },
    };
    const [state, dispatch] = useReducer(reducer, initState);

    return <UserContext.Provider value={[state, dispatch]}>{children}</UserContext.Provider>;
}

export default Provider;
