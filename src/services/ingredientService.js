import * as httpRequest from '../utils/httpRequest';

export const getListIngredient = async () => {
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

export const updateImport = async (id, body) => {
    try {
        const res = await httpRequest.patch(`import/${id}`, body);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const updateExport = async (id, body) => {
    try {
        const res = await httpRequest.patch(`export/${id}`, body);
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

export const deleteImportIngredient = async (data) => {
    const config = { data };
    try {
        const res = await httpRequest.del(`import/ingredient`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const deleteExportIngredient = async (data) => {
    const config = { data };
    try {
        const res = await httpRequest.del(`export/ingredient`, config);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const completeExport = async (id) => {
    try {
        const res = await httpRequest.get(`export/complete/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
export const completeImport = async (id) => {
    try {
        const res = await httpRequest.get(`import/complete/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const cancelImport = async (id) => {
    try {
        const res = await httpRequest.del(`import/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const cancelExport = async (id) => {
    try {
        const res = await httpRequest.del(`export/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};

export const importIngredient = async (price, quantity, idIngredient) => {
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
export const exportIngredient = async (info, quantity, idIngredient) => {
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
