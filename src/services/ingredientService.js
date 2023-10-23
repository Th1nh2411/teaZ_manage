import * as httpRequest from '../utils/httpRequest';

export const getListIngredient = async (token) => {
    try {
        const res = await httpRequest.get('ingredient');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getListIngredientToImport = async (id) => {
    try {
        const res = await httpRequest.get(`import/ingredient/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getListIngredientToExport = async (id) => {
    try {
        const res = await httpRequest.get(`export/ingredient/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const updateImport = async (body) => {
    try {
        const res = await httpRequest.patch(`import`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const updateExport = async (body) => {
    try {
        const res = await httpRequest.patch(`export`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getDetailImport = async (id) => {
    try {
        const res = await httpRequest.get(`import/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getDetailExport = async (id) => {
    try {
        const res = await httpRequest.get(`export/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllImport = async (params) => {
    try {
        const config = { params };
        const res = await httpRequest.get(`import`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const getAllExport = async (params) => {
    try {
        const config = { params };
        const res = await httpRequest.get(`export`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const createImport = async (body) => {
    try {
        const res = await httpRequest.post(`import`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const createExport = async (body) => {
    try {
        const res = await httpRequest.post(`export`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const createImportIngredient = async (body) => {
    try {
        const res = await httpRequest.post(`import/ingredient`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const createExportIngredient = async (body) => {
    try {
        const res = await httpRequest.post(`export/ingredient`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const deleteImportIngredient = async (body) => {
    try {
        const res = await httpRequest.del(`import/ingredient`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const deleteExportIngredient = async (body) => {
    try {
        const res = await httpRequest.del(`export/ingredient`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const completeExport = async (id, token) => {
    try {
        const res = await httpRequest.put(`export/cancel/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const completeImport = async (id, token) => {
    try {
        const res = await httpRequest.put('invoice/completeInvoice');
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const cancelImport = async (id, token) => {
    try {
        const res = await httpRequest.del(`import/cancel/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const cancelExport = async (id, token) => {
    try {
        const res = await httpRequest.del(`export/cancel/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const importIngredient = async (price, quantity, idIngredient, token) => {
    const body = {
        price,
        quantity,
    };
    try {
        const res = await httpRequest.put(`shop/import/${idIngredient}`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const exportIngredient = async (info, quantity, idIngredient, token) => {
    const body = {
        info,
        quantity,
    };
    try {
        const res = await httpRequest.put(`shop/export/${idIngredient}`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
