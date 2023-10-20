import * as httpRequest from '../utils/httpRequest';

export const getAllInvoice = async (token) => {
    try {
        const res = await httpRequest.get('invoice');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getAllInvoiceInTransit = async (token) => {
    try {
        const res = await httpRequest.get('invoice/?status=2');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllConfirmedInvoice = async (token) => {
    try {
        const res = await httpRequest.get('invoice/?status=1');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllCompletedInvoice = async (token) => {
    try {
        const res = await httpRequest.get('invoice/?status=1');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllUnConfirmedInvoice = async (token) => {
    try {
        const res = await httpRequest.get('invoice/?status=0');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const cancelInvoice = async (id, token) => {
    try {
        const res = await httpRequest.del(`invoice/cancel/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const confirmInvoice = async (id, token) => {
    try {
        const res = await httpRequest.get(`invoice/confirm/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const receiveInvoice = async (id, token) => {
    try {
        const res = await httpRequest.get(`invoice/receive/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const completeInvoice = async (id, token) => {
    try {
        const res = await httpRequest.put(`invoice/completeInvoice/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllInvoiceByDate = async (date, token) => {
    try {
        const res = await httpRequest.get(`invoice/getAllInvoiceByDate/${date}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
