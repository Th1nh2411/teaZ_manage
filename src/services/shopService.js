import * as httpRequest from '../utils/httpRequest';

export const getInfoShop = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get('shop/info', config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editInfoShop = async (image, isActive, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = { image, isActive };
    try {
        const res = await httpRequest.put('shop/editInfo', body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getListStaff = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get('manager/getListStaff', config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addStaff = async (phone, name, password, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        phone,
        name,
        password,
    };
    try {
        const res = await httpRequest.post('manager/addStaff', body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editStaff = async (idStaff, token, phone, name, password) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        phone,
        name,
        password,
    };
    try {
        const res = await httpRequest.patch(`manager/editStaff/${idStaff}`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const deleteStaff = async (phone, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        phone,
    };
    try {
        const res = await httpRequest.del('manager/deleteStaff', body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
