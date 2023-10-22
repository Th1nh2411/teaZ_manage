import * as httpRequest from '../utils/httpRequest';

export const getAllInvoice = async () => {
    try {
        const res = await httpRequest.get('invoice');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllInvoiceInTransit = async () => {
    try {
        const res = await httpRequest.get('invoice/?status=2');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllConfirmedInvoice = async () => {
    try {
        const res = await httpRequest.get('invoice/?status=1');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllCompletedInvoice = async () => {
    try {
        const res = await httpRequest.get('invoice/?status=1');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllUnConfirmedInvoice = async () => {
    try {
        const res = await httpRequest.get('invoice/?status=0');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const cancelInvoice = async (id) => {
    try {
        const res = await httpRequest.del(`invoice/cancel/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const confirmInvoice = async (id) => {
    try {
        const res = await httpRequest.get(`invoice/confirm/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const doneCookInvoice = async (id) => {
    try {
        const res = await httpRequest.get(`invoice/receive/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const completeInvoice = async (id) => {
    try {
        const res = await httpRequest.get(`invoice/complete/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllInvoiceByDateAndStatus = async (fromdate, todate, status) => {
    try {
        const config = {
            params: {
                fromdate,
                todate,
                status,
            },
        };
        const res = await httpRequest.get(`invoice`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
