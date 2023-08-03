import axios from 'axios';
const mapRequest = axios.create({
    baseURL: 'https://nominatim.openstreetmap.org/',
});
export const getAddress = async (latitude, longitude) => {
    const config = {
        params: {
            format: 'jsonv2',
            lat: latitude,
            lon: longitude,
        },
    };
    try {
        const res = await mapRequest.get('reverse', config);
        return res.data;
    } catch (error) {
        console.log(error);
        // return error.response.data;
    }
};
export const searchAddress = async (q, limit = 5) => {
    const config = {
        params: {
            q,
            format: 'json',
            addressdetails: 1,
            limit,
            countrycodes: 'vn',
        },
    };
    try {
        const res = await mapRequest.get('', config);
        return res.data;
    } catch (error) {
        console.log(error);
        // return error.response.data;
    }
};
