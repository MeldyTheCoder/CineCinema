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
    console.log(response);
    if (response.status === 401) {
        logoutFx();
    }
    return response;
}, async (error) => {
    if (error.response && error.response.status === 401) {
        logoutFx();
    }
})