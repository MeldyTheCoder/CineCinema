import { createStore, createEffect, createEvent, sample } from "effector";
import { app } from "../app";
import { AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import { TBonusResponse, TUser } from "../types";
import { objectToCamelCase } from "../utils/camelCase";

export type TValidatePhoneRequest = {
  phone: string;
  code: string;
};

type TRegisterSmsRequest = TValidatePhoneRequest & Pick<TUser, "firstName">;

type TSendSmsRequest = {
  phone?: string;
};

type TokenData = {
  sub: string;
  exp: string;
};

type TokenStorage = {
  accessToken: string;
  tokenType: string;
  data?: TokenData;
};

type TValidatePhoneResponse = {
  accessToken: string;
  tokenType: string;
};

type TEditProfileRequest = {
  firstName?: TUser["firstName"];
  lastName?: TUser["lastName"];
  avatar?: string;
};

type TChangeAvatarRequest = File;

export type TAuthData = {
  phone?: string;
  code?: string;
  isAuthorized: boolean;
};

export const $user = createStore<TUser | null>(null);
export const $tokenData = createStore<TokenStorage>({
  accessToken: "",
  tokenType: "Bearer",
});

export const sendAuthCodeEv = createEvent<TSendSmsRequest>();
export const sendAuthCodeFx = createEffect<TSendSmsRequest, boolean, Error>({
  name: "sendCodeFx",
  handler: async ({ phone }) => {
    const { status } = await app.post("/users/auth/send-sms/", {
      phone,
    });

    return status === 200;
  },
});

export const sendRegistrationCodeEv = createEvent<TSendSmsRequest>();
export const sendRegistrationCodeFx = createEffect<
  TSendSmsRequest,
  boolean,
  Error
>({
  name: "sendCodeFx",
  handler: async ({ phone }) => {
    const { status } = await app.post("/users/registration/send-sms/", {
      phone,
    });

    return status === 200;
  },
});

export const loadAuthenticatedUserFx = createEffect<void, TUser, Error>({
  name: "loadAuthenticatedUserFx",
  handler: async () => {
    const response = await app.get("/users/me/");
    return objectToCamelCase<TUser>(response.data);
  },
});
export const authenticateFx = createEffect<
  TValidatePhoneResponse,
  TokenStorage,
  Error
>({
  name: "authenticateFx",
  handler: async ({ accessToken, tokenType }) => {
    const tokenData = jwtDecode<TokenData>(accessToken);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("tokenType", tokenType);
    return { accessToken, tokenType, data: tokenData };
  },
});

export const logoutFx = createEffect<void, TokenStorage, Error>({
  name: "logoutFx",
  handler: async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenType");
    return { accessToken: "", tokenType: "" } as TokenStorage;
  },
});

export const loginEv = createEvent<TValidatePhoneRequest>();
export const loginFx = createEffect<TValidatePhoneRequest, TokenStorage, Error>(
  {
    name: "loginFx",
    handler: async ({ phone, code }) => {
      const response = await app.post<
        TValidatePhoneRequest,
        AxiosResponse<TValidatePhoneResponse>
      >("/users/auth/validate-sms/", {
        phone,
        code,
      });

      if (response.status === 200) {
        return await authenticateFx(response.data);
      }

      throw new Error("Не удалость войти в аккаунт.");
    },
  }
);

export const registerSmsEv = createEvent<TRegisterSmsRequest>();
export const registerSmsFx = createEffect<TRegisterSmsRequest, TokenStorage, Error>({
  name: "registerSmsFx",
  handler: async ({ phone, code, firstName }) => {
    const response = await app.post<
      TRegisterSmsRequest,
      AxiosResponse<TValidatePhoneResponse>
    >("/users/registration/validate-sms/", {
      phone,
      code,
      firstName,
    });

    if (response.status === 200) {
      return await authenticateFx(response.data);
    }

    throw new Error("Не удалость зарегистрировать аккаунт.");
  },
});

export const editProfileFx = createEffect<TEditProfileRequest, TUser, Error>({
  name: "editProfileFx",
  handler: async (data) => {
    const response = await app.post<any, AxiosResponse<TUser>>(
      "/users/edit",
      data
    );
    return objectToCamelCase<TUser>(response.data);
  },
});

export const changeAvatarFx = createEffect<TChangeAvatarRequest, string, Error>(
  {
    name: "changeAvatarFx",
    handler: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await app.post<any>("/users/avatar/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  }
);

$tokenData.on(authenticateFx.doneData, (_, payload) => payload);
$user.on(loadAuthenticatedUserFx.doneData, (_, userData) => userData);
$user.on(editProfileFx.doneData, (_, response) => response);
$user.on(changeAvatarFx.doneData, (state, avatar) => ({
  ...(state || {}),
  avatar,
}));

sample({
  clock: sendAuthCodeEv,
  target: sendAuthCodeFx,
});

sample({
  clock: loginEv,
  target: loginFx,
});

sample({
  clock: authenticateFx,
  target: loadAuthenticatedUserFx,
});

sample({
  clock: logoutFx.doneData,
  target: $tokenData,
});
