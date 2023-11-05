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
        const res = await httpRequest.get(`8da3ab8f-9f8b-4a46-ba08-3f704f13054e`, config);
        return res.data;
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
