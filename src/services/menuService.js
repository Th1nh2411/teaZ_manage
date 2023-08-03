import * as httpRequest from '../utils/httpRequest';

export const getMenuByType = async (idType = 1, token) => {
    const config = {
        headers: { access_token: token },
        params: { idType },
    };
    try {
        const res = await httpRequest.get('shop/typeForStaff', config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const editMenuItem = async (idRecipe, isActive, discount, token) => {
    const config = {
        headers: { access_token: token },
    };
    console.log(discount);
    const body = {
        isActive,
        discount,
    };
    try {
        const res = await httpRequest.put(`shop/editRecipeShop/${idRecipe}`, body, config);
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
        const res = await httpRequest.get(`shop/detailRecipe/${idRecipe}`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
