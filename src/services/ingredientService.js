import * as httpRequest from '../utils/httpRequest';

export const getListIngredient = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get('shop/listIngredientShop', config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const importIngredient = async (price, quantity, idIngredient, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        price,
        quantity,
    };
    try {
        const res = await httpRequest.put(`shop/import/${idIngredient}`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const exportIngredient = async (info, quantity, idIngredient, token) => {
    const config = {
        headers: { access_token: token },
    };
    const body = {
        info,
        quantity,
    };
    try {
        const res = await httpRequest.put(`shop/export/${idIngredient}`, body, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
