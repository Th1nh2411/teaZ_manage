import * as httpRequest2 from '../utils/httpRequest';
import axios from 'axios';
const httpRequest = axios.create({
    baseURL: 'https://mocki.io/v1/',
});

export const getListIngredient = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get('37a16770-ce25-4de1-8b85-594702a4bf8f', config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const importIngredient = async (price, quantity, idIngredient, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        price,
        quantity,
    };
    try {
        const res = await httpRequest.get(`4880c9ba-59f9-46d9-bbce-d73be5c7be9f`, body, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const exportIngredient = async (info, quantity, idIngredient, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        info,
        quantity,
    };
    try {
        const res = await httpRequest.get(`4880c9ba-59f9-46d9-bbce-d73be5c7be9f`, body, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
