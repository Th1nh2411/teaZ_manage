import * as httpRequest from '../utils/httpRequest';

export const getMenuByType = async (id) => {
    try {
        const res = await httpRequest.get(`recipe/menu/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllMenu = async () => {
    try {
        const res = await httpRequest.get(`recipe/menu`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllMenuBySearch = async (keyword) => {
    try {
        const res = await httpRequest.get(`recipe/menu?keyword=${keyword}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllTopping = async (keyword) => {
    try {
        const res = await httpRequest.get(`recipe/topping`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllIngredientByRecipe = async (id) => {
    try {
        const res = await httpRequest.get(`recipe/ingredient/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllToppingByType = async (id) => {
    try {
        const res = await httpRequest.get(`recipe/type-topping/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllToppingByRecipe = async (id) => {
    try {
        const res = await httpRequest.get(`recipe/recipe-topping/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const createRecipe = async (body) => {
    try {
        const res = await httpRequest.post(`recipe`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const updateRecipe = async (body) => {
    try {
        const res = await httpRequest.patch(`recipe`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const deleteRecipe = async (id) => {
    try {
        const res = await httpRequest.del(`recipe/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getDetailRecipe = async (id) => {
    try {
        const res = await httpRequest.get(`recipe/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
