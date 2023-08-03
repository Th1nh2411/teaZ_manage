import * as httpRequest from '../utils/httpRequest';

export const getListManager = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get('admin/getListManager', config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addManager = async (idShop, phone, password, name, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        idShop,
        phone,
        password,
        name,
    };
    try {
        const res = await httpRequest.post('admin/addManager', body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editManager = async (idStaff, idShop, token, phone, password, name) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        idShop,
        phone,
        password,
        name,
    };
    try {
        const res = await httpRequest.patch(`admin/editManager/${idStaff}`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const deleteManager = async (phone, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        phone,
    };
    try {
        const res = await httpRequest.del(`admin/deleteManager`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getListShop = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get('admin/getListShop', config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addShop = async (token, address, latitude, longitude, image, isActive) => {
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
        const res = await httpRequest.post(`admin/addShop`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
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
        const res = await httpRequest.patch(`admin/editShop/${idShop}`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getDataForChartByShop = async (idShop, token) => {
    const config = {
        headers: { access_token: token },
    };

    try {
        const res = await httpRequest.get(`admin/getDataForChart/${idShop}`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getAllShopDataForChart = async (token) => {
    const config = {
        headers: { access_token: token },
    };

    try {
        const res = await httpRequest.get(`admin/getAllDataForChart`, config);
        return res;
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
        const res = await httpRequest.get(`admin/getListIngredient`, config);
        return res;
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
        const res = await httpRequest.post(`admin/addIngredient`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editIngredient = async (idIngredient, token, name, image, unitName, isDel) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        name,
        image,
        unitName,
        isDel,
    };
    try {
        const res = await httpRequest.patch(`admin/editIngredient/${idIngredient}`, body, config);
        return res;
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
        const res = await httpRequest.get(`admin/getListRecipe`, config);
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
        const res = await httpRequest.get(`admin/getDetailRecipe/${idRecipe}`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const addRecipe = async (name, image, info, price, idType, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        name,
        image,
        info,
        price,
        idType,
    };
    try {
        const res = await httpRequest.post(`admin/addRecipe`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editRecipe = async (idRecipe, token, isDel, name, image, info, price, idType) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        name,
        image,
        info,
        price,
        idType,
        isDel,
    };
    try {
        const res = await httpRequest.patch(`admin/editRecipe/${idRecipe}`, body, config);
        return res;
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
        const res = await httpRequest.put(`admin/editRecipeIngredient`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getListToppingByType = async () => {
    try {
        const res = await httpRequest.get(`admin/getListType`);
        return res;
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
        const res = await httpRequest.post(`admin/addRecipeType`, body, config);
        return res;
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
        const res = await httpRequest.del(`admin/deleteRecipeType`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
