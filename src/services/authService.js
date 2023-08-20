import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'https://mocki.io/v1/',
});
export const login = async (username, password) => {
    // const config = {
    //     headers: { access_token: token },
    // };
    const body = {
        username,
        password,
    };
    try {
        const res = await httpRequest.get('497c1688-056a-4502-b9a5-7eff5df7dadc', body);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const refreshToken = async (username) => {
    // const config = {
    //     headers: { access_token: token },
    // };
    const body = {
        username,
    };
    try {
        const res = await httpRequest.post('account/refreshToken', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
