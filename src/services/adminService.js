import * as httpRequest from '../utils/httpRequest';

export const getListManager = async (token) => {
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

export const getListShop = async (token) => {
    try {
        const res = await httpRequest.get('admin/getListShop');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addShop = async (token, address, latitude, longitude, image, isActive) => {
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
export const getDataForChartByShop = async (idShop, token) => {
    try {
        const res = await httpRequest.get(`admin/getDataForChart/${idShop}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getAllShopDataForChart = async (token) => {
    try {
        const res = await httpRequest.get(`admin/getAllDataForChart`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getAllIngredient = async (token) => {
    try {
        const res = await httpRequest.get(`ingredient`);
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
export const getAllRecipe = async (idType, token) => {
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
export const getDetailRecipe = async (idRecipe, token) => {
    try {
        const res = await httpRequest.get(`admin/getDetailRecipe/${idRecipe}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addRecipe = async (name, image, info, price, discount, idType, token) => {
    const body = {
        name,
        image,
        info,
        price,
        discount,
        idType,
    };
    try {
        const res = await httpRequest.post(`admin/addRecipe`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editRecipe = async (idRecipe, token, body) => {
    try {
        const res = await httpRequest.patch(`admin/editRecipe/${idRecipe}`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editIngredientFromRecipe = async (idRecipe, idIngredient, quantity, token) => {
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
export const getListToppingByType = async () => {
    try {
        const res = await httpRequest.get(`recipe/type-topping`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addToppingToType = async (idRecipe, idType, token) => {
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
export const delToppingFromType = async (idRecipe, idType, token) => {
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
export const uploadFile = async (my_file, token) => {
    const config = {
        headers: { access_token: token, 'Content-Type': 'multipart/form-data' },
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
