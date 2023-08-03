import * as httpRequest from '../utils/httpRequest';

export const getAllOrder = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get('order/getAllOrder', config);
        return res;
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
        const res = await httpRequest.get('order/getAllOrderInTransit', config);
        return res;
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
        const res = await httpRequest.put('order/completeOrder', { idInvoice }, config);
        return res;
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
        const res = await httpRequest.put('order/completeInvoice', { idInvoice }, config);
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
        const res = await httpRequest.get(`order/getAllInvoiceByDate/${date}`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
