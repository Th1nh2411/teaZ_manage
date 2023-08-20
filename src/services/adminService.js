import * as httpRequest2 from '../utils/httpRequest';
import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'https://mocki.io/v1/',
});
export const editShop = async (idShop, token, address, latitude, longitude, image, isActive) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        address,
        latitude,
        longitude,
        image,
        isActive,
    };
    try {
        const res = await httpRequest.get('4880c9ba-59f9-46d9-bbce-d73be5c7be9f');
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getAllIngredient = async (token) => {
    const config = {
        headers: { access_token: token },
    };

    try {
        const res = await httpRequest.get(`7ac77bba-a8a4-4ea0-a5d8-fcd087d1e19d`, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addIngredient = async (name, image, unitName, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        name,
        image,
        unitName,
    };
    try {
        const res = await httpRequest.get('4880c9ba-59f9-46d9-bbce-d73be5c7be9f');
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editIngredient = async (idIngredient, token, name, image, unitName, isActive) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        name,
        image,
        unitName,
        isActive,
    };
    try {
        const res = await httpRequest.get('4880c9ba-59f9-46d9-bbce-d73be5c7be9f');
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getAllRecipe = async (idType, token) => {
    const config = {
        headers: { access_token: token },
        params: {
            idType,
        },
    };

    try {
        const res = await httpRequest2.get(`admin/getListRecipe`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getDetailRecipe = async (idRecipe, token) => {
    const config = {
        headers: { access_token: token },
    };

    try {
        const res = await httpRequest2.get(`admin/getDetailRecipe/${idRecipe}`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addRecipe = async (name, image, info, price, discount, idType, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        name,
        image,
        info,
        price,
        discount,
        idType,
    };
    try {
        const res = await httpRequest.get('4880c9ba-59f9-46d9-bbce-d73be5c7be9f');
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editRecipe = async (idRecipe, token, body) => {
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
export const editIngredientFromRecipe = async (idRecipe, idIngredient, quantity, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        idRecipe,
        idIngredient,
        quantity,
    };
    try {
        const res = await httpRequest.get('4880c9ba-59f9-46d9-bbce-d73be5c7be9f');
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getListToppingByType = async () => {
    try {
        const res = await httpRequest.get(`0cda3269-50df-4f8e-ae81-644ca5330427`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addToppingToType = async (idRecipe, idType, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        idRecipe,
        idType,
    };
    try {
        const res = await httpRequest.get('4880c9ba-59f9-46d9-bbce-d73be5c7be9f');
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const delToppingFromType = async (idRecipe, idType, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        idRecipe,
        idType,
    };
    try {
        const res = await httpRequest.get('4880c9ba-59f9-46d9-bbce-d73be5c7be9f');
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const uploadFile = async (my_file, token) => {
    const config = {
        headers: { access_token: token, 'Content-Type': 'multipart/form-data' },
    };
    const body = {
        my_file,
    };
    try {
        const res = await httpRequest.get(`0fb03573-c878-4818-a4c7-cef99030cc07`, body, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
