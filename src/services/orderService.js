import * as httpRequest2 from '../utils/httpRequest';
import axios from 'axios';
const httpRequest = axios.create({
    baseURL: 'https://mocki.io/v1/',
});
export const getAllOrder = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get('c28a3f63-6744-4de5-9ae3-a37dc0508bd8', config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getAllOrderInTransit = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest2.get('order/getAllOrderInTransit', config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const cancelInvoice = async (idInvoice, token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get(`4880c9ba-59f9-46d9-bbce-d73be5c7be9f`, {}, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const completeOrder = async (idInvoice, token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get('4880c9ba-59f9-46d9-bbce-d73be5c7be9f', { idInvoice }, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const completeInvoice = async (idInvoice, token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest2.put('order/completeInvoice', { idInvoice }, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getAllInvoiceByDate = async (date, token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest2.get(`order/getAllInvoiceByDate/${date}`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
