import * as httpRequest from '../utils/httpRequest';

export const getListManager = async () => {
    try {
        const res = await httpRequest.get('admin/getListManager');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const deleteIngredient = async (id) => {
    try {
        const res = await httpRequest.del(`ingredient/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getListShop = async () => {
    try {
        const res = await httpRequest.get('admin/getListShop');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addShop = async (address, latitude, longitude, image, isActive) => {
    const body = {
        address,
        latitude,
        longitude,
        image,
        isActive,
    };
    try {
        const res = await httpRequest.post(`admin/addShop`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editShop = async (body) => {
    try {
        const res = await httpRequest.patch(`shop`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getDataForChartByShop = async (idShop) => {
    try {
        const res = await httpRequest.get(`admin/getDataForChart/${idShop}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getAllShopDataForChart = async () => {
    try {
        const res = await httpRequest.get(`admin/getAllDataForChart`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getAllIngredient = async (name) => {
    try {
        const config = { params: { name } };
        const res = await httpRequest.get(`ingredient`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addIngredient = async (body) => {
    try {
        const res = await httpRequest.post(`ingredient`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editIngredient = async (id, body) => {
    try {
        console.log(id);
        console.log(body);
        const res = await httpRequest.patch(`ingredient/${id}`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getAllRecipe = async (idType) => {
    const config = {
        params: {
            idType,
        },
    };

    try {
        const res = await httpRequest.get(`admin/getListRecipe`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getDetailRecipe = async (idRecipe) => {
    try {
        const res = await httpRequest.get(`recipe/${idRecipe}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addRecipe = async (name, image, info, price, discount, idType) => {
    const body = {
        name,
        image,
        info,
        price,
        discount,
        idType,
    };
    try {
        const res = await httpRequest.post(`recipe`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editRecipe = async (idRecipe, body) => {
    try {
        const res = await httpRequest.patch(`recipe/${idRecipe}`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editIngredientFromRecipe = async (idRecipe, idIngredient, quantity) => {
    const body = {
        idRecipe,
        idIngredient,
        quantity,
    };
    try {
        const res = await httpRequest.put(`admin/editRecipeIngredient`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getListToppingByType = async (idType) => {
    try {
        const res = await httpRequest.get(`recipe/type-topping/${idType}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addToppingToType = async (idRecipe, idType) => {
    const body = {
        idRecipe,
        idType,
    };
    try {
        const res = await httpRequest.post(`admin/addRecipeType`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const delToppingFromType = async (idRecipe, idType) => {
    const body = {
        idRecipe,
        idType,
    };
    try {
        const res = await httpRequest.del(`admin/deleteRecipeType`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const uploadFile = async (my_file) => {
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
    };
    const body = {
        my_file,
    };
    try {
        const res = await httpRequest.post(`auth/upload`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
