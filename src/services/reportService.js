import * as httpRequest from '../utils/httpRequest';

export const getReportByDate = async (fromdate, todate) => {
    const config = {
        params: { fromdate, todate },
    };
    try {
        const res = await httpRequest.get(`invoice/statistical/get`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getStatisticalByDate = async (fromdate, todate) => {
    try {
        const res = await httpRequest.get(`invoice/statistical/get?fromdate=${fromdate}&todate=${todate}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getIngredientReportByDate = async (date, token, type = 'month') => {
    const config = {
        params: { type },
    };
    try {
        const res = await httpRequest.get(`admin/detailChangeIngredientShop/${date}`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const get6PrevMonthReport = async (token) => {
    try {
        const res = await httpRequest.get(``);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
