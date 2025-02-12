import axios from './axiosConfig'

export const makeRequest = async (method, url, data=null) => {
    try {
        const response = await axios({
            method,
            url,
            data,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        return { status: `${response.status}`, message: `${response.data.message}`, data:response.data };
    } catch (error) {
        console.error(error);
        if (!error.response) {
            return { message: 'No response from server' };
        }
        return { status: `${error.response.status}`, message: `${error.response.data.message}` };
        // throw new Error(`Error: ${error.response.status} - ${error.response.statusText} - ${error.response.data.message}`);
    }
};