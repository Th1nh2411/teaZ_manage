import * as httpRequest2 from '../utils/httpRequest';
import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'https://mocki.io/v1/',
});
export const getReportByDate = async (date, token, quantity = 3, type = 'month') => {
    const config = {
        headers: { access_token: token },
        params: { quantity, type },
    };
    try {
        const res = await httpRequest.get(`2221d957-4468-4cc9-8839-3b701d1d56f6`, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getIngredientReportByDate = async (date, token, type = 'month') => {
    const config = {
        headers: { access_token: token },
        params: { type },
    };
    try {
        const res = await httpRequest.get(`8da3ab8f-9f8b-4a46-ba08-3f704f13054e`, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const get6PrevMonthReport = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get(`4b4fcf21-9f5b-4d2d-bc68-777e70032e2c`, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
