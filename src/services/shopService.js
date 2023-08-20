import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'https://mocki.io/v1/',
});
export const getInfoShop = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get('b8246da0-e07d-4c22-aa61-bdfc93fede17', config);
        return res.data;
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
        const res = await httpRequest.get('4880c9ba-59f9-46d9-bbce-d73be5c7be9f');
        return res.data;
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
        const res = await httpRequest.get('6645a0f7-6dfc-4f96-b5cb-886727c45355', config);
        return res.data;
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
        const res = await httpRequest.get('4880c9ba-59f9-46d9-bbce-d73be5c7be9f');
        return res.data;
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
        const res = await httpRequest.get('4880c9ba-59f9-46d9-bbce-d73be5c7be9f');
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const deleteStaff = async (username, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        username,
    };
    try {
        const res = await httpRequest.get('4880c9ba-59f9-46d9-bbce-d73be5c7be9f');
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
