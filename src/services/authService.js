import * as httpRequest from '../utils/httpRequest';

export const login = async (data = {}, token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.post('account/login', data);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
