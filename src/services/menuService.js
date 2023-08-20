import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'https://mocki.io/v1/',
});

export const getMenuByType = async (idType = 1, token) => {
    const config = {
        headers: { access_token: token },
        params: { idType },
    };
    try {
        const res = await httpRequest.get('cf8f6788-826c-471e-bb97-f26ad4d03776', config);
        return res.data;
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
        const res = await httpRequest.get(`0b8d3998-4b3f-44cb-8740-16f2e13fdf9f`, config);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response && error.response.data;
    }
};
