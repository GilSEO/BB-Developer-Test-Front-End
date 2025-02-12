// src/axios.js
import axios from 'axios';

// Axios instance for protected API endpoints (e.g., login, capsules)
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Use 127.0.0.1 consistently
    withCredentials: true,                // Ensures cookies are sent with requests
});

// Axios instance for CSRF cookie requests (should NOT use the /api prefix)
const csrfApi = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    withCredentials: true,
});

// Updated interceptor using a RegExp to reliably extract the token
// Add an interceptor to attach the CSRF token from cookies
api.interceptors.request.use(config => {

    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match && match[1]) {
        const token = decodeURIComponent(match[1]);
        config.headers['X-XSRF-TOKEN'] = token;
    } else {
        console.warn("No XSRF-TOKEN cookie found");
    }
    return config;
}, error => Promise.reject(error));

export { api, csrfApi };
