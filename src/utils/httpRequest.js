import axios from 'axios';
const httpRequest = axios.create({
    baseURL: 'http://26.119.98.45:3007/',
});
export const get = async (path, header = {}) => {
    const response = await httpRequest.get(path, header);
    return response.data;
};
export const post = async (path, body = {}, header = {}) => {
    const response = await httpRequest.post(path, body, header);
    return response.data;
};
export const del = async (path, body = {}, config = {}) => {
    const data = { data: body, ...config };
    const response = await httpRequest.delete(path, data);
    return response.data;
};
export const put = async (path, body = {}, header = {}) => {
    const response = await httpRequest.put(path, body, header);
    return response.data;
};
export const patch = async (path, body = {}, header = {}) => {
    const response = await httpRequest.patch(path, body, header);
    return response.data;
};
// export default httpRequest;
