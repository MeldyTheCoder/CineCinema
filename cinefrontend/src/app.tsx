import axios from "axios";
import { logoutFx } from "./effector/users.store";


export const app = axios.create({
    baseURL: "http://localhost:8080/"
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
        logoutFx();
    }
    return response;
}, async (error) => {
    if (error.response && error.response.status === 401) {
        logoutFx();
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