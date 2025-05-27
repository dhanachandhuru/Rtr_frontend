import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 5000,
});


// Add a request interceptor to include the token in every request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;