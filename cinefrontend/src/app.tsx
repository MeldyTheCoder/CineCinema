import axios from "axios";
import { logoutFx } from "./effector/users.store";

const IS_PROD = import.meta.env.PROD;

const BASE_URL = IS_PROD ? `${location.origin}/api/` : 'http://localhost:8080';

export const app = axios.create({
    baseURL: BASE_URL
});

app.interceptors.request.use(async (request) => {
    const accessToken = localStorage.getItem('accessToken');
    const tokenType = localStorage.getItem('tokenType');

    if (accessToken && tokenType) {
        request.headers.Authorization = `${tokenType} ${accessToken}`;
    }

    return request;
});

app.interceptors.response.use(async (response) => {
    if (response.status === 401) {
        logoutFx().then(() => {
            window.location.href = `/login/?next=${encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)}`;
        });
    }
    return response;
}, async (error) => {
    if (error.response && error.response.status === 401) {
        logoutFx().then(() => {
            window.location.href = `/login/?next=${encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)}`;
        });
    }
    return error;
})

app.interceptors.response.use(
    (response) => {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        return Promise.reject(response);
    },
    (error) => {
        return Promise.reject(error.response.detail);
    }
);