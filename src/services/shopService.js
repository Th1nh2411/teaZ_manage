import * as httpRequest from '../utils/httpRequest';

export const getInfoShop = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get('shop/getShopInfo', config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editInfoShop = async (body, token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.patch('shop/editInfo', body, config);
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
        const res = await httpRequest.get('admin/getListStaff', config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addStaff = async (phone, mail, name, password, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        phone,
        name,
        mail,
        password,
    };
    try {
        const res = await httpRequest.post('admin/addStaff', body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editStaff = async (idStaff, token, phone, mail, name, password) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        phone,
        name,
        password,
        mail,
    };
    try {
        const res = await httpRequest.patch(`admin/editStaff/${idStaff}`, body, config);
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
        const res = await httpRequest.del('admin/deleteStaff', body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
