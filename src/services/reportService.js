import * as httpRequest from '../utils/httpRequest';

export const getReportByDate = async (date, token, quantity = 3, type = 'month') => {
    const config = {
        headers: { access_token: token },
        params: { quantity, type },
    };
    try {
        const res = await httpRequest.get(`manager/reportByDate/${date}`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const getIngredientReportByDate = async (date, token, type = 'month') => {
    const config = {
        headers: { access_token: token },
        params: { type },
    };
    try {
        const res = await httpRequest.get(`manager/detailChangeIngredientShop/${date}`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const get6PrevMonthReport = async (token) => {
    const config = {
        headers: { access_token: token },
    };
    try {
        const res = await httpRequest.get(`manager/getDataForChart`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
