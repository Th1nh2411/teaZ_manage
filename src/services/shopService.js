import * as httpRequest from '../utils/httpRequest';

export const getInfoShop = async () => {
    try {
        const res = await httpRequest.get('shop');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editInfoShop = async (body) => {
    try {
        const res = await httpRequest.patch('shop', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getListStaff = async (token) => {
    try {
        const res = await httpRequest.get('staff');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addStaff = async (body) => {
    try {
        const res = await httpRequest.post('staff', body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editStaff = async (id, body) => {
    try {
        const res = await httpRequest.patch(`staff/${id}`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const deleteStaff = async (id) => {
    try {
        const res = await httpRequest.del(`staff/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
