import { createStore, createEffect, createEvent, sample, createApi } from "effector";
import {app} from '../app'
import { AxiosResponse } from "axios";
import {jwtDecode} from 'jwt-decode';
import { TUser } from "../types";

export type TValidatePhoneRequest = {
    phone: string;
    code: string;
}

type TSendSmsRequest = {
    phone?: string;
}

type TokenData = {
    sub: string;
    exp: string;
}

type TokenStorage = {
    accessToken: string;
    tokenType: string;
    data?: TokenData;
}

type TValidatePhoneResponse = {
    accessToken: string;
    tokenType: string;
}

export type TAuthData = {
    phone?: string;
    code?: string;
    isAuthorized: boolean;
}

export const $user = createStore<TUser | null>(null);
export const $tokenData = createStore<TokenStorage>({accessToken: '', tokenType: 'Bearer'});

export const sendCodeEv = createEvent<TSendSmsRequest>();
export const sendCodeFx = createEffect<TSendSmsRequest, boolean, Error>({
    name: 'sendCodeFx',
    handler: async ({phone}) => {
        const {status} = await app.post('/users/send-sms/', {
            phone
        });

        return status === 200;
    }
});

export const loadAuthenticatedUserFx = createEffect<void, TUser, Error>({
    name: 'loadAuthenticatedUserFx',
    handler: async () => {
        const response = await app.get('/users/me/');
        return response.data as TUser;
    }
})
export const authenticateFx = createEffect<TValidatePhoneResponse, TokenStorage, Error>({
    name: 'authenticateFx',
    handler: async ({accessToken, tokenType}) => {
        const tokenData = jwtDecode<TokenData>(accessToken);

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('tokenType', tokenType);
        return {accessToken, tokenType, data: tokenData};
    }
});

export const logoutFx = createEffect<void, void, Error>({
    name: 'logoutFx',
    handler: async () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenType');
    }
});
export const loginEv = createEvent<TValidatePhoneRequest>();
export const loginFx = createEffect<TValidatePhoneRequest, TokenStorage, Error>({
    name: 'loginFx',
    handler: async ({phone, code}) => {
        const response = await app.post<TValidatePhoneRequest, AxiosResponse<TValidatePhoneResponse>>('/users/validate-sms/', {
            phone,
            code,
        })

        if (response.status === 200) {
            return await authenticateFx(response.data);
        }

        throw new Error("Не удалость войти в аккаунт.")
    }
});

$tokenData.on(authenticateFx.doneData, (_, payload) => payload);
$user.on(loadAuthenticatedUserFx.doneData, (_, userData) => userData);

sample({
    clock: sendCodeEv,
    target: sendCodeFx,
});

sample({
    clock: loginEv,
    target: loginFx,
});

sample({
    clock: authenticateFx,
    target: loadAuthenticatedUserFx,
})
