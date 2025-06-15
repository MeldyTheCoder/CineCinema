import { createEffect, createEvent, createStore, sample, split } from "effector";
import { OrderStatuses, TOrder, TSeat } from "../types";
import { app } from "../app";
import { camelArray, objectToCamelCase } from "../utils/camelCase";
import { pending } from "patronum";
import { stringify } from "qs";

type LoadUserOrdersRequest = {
  page?: number;
  status?: OrderStatuses | `${OrderStatuses}`;
  search?: string;
};

type CreateOrderRequest = {
  seats: number[];
  schedule: number;
  paymentData: {paymentData: string; [x: string]: any}
}

type CreateOrderResponse = {
  order: TOrder;
  payment: {readonly id: number};
}

export type AddLocalOrderRequest = {
  orderId: number;
  price: number;
};

export const $orders = createStore<TOrder[]>([]);

export const loadUserOrdersFx = createEffect<
  LoadUserOrdersRequest,
  TOrder[],
  Error
>({
  name: "loadUserOrdersFx",
  handler: async (data) => {
    const response = await app.get<TOrder[]>(
      !data
        ? "/orders/"
        : `/orders/?${stringify({
            ...data,
            status: (data.status as any) === "all" ? undefined : data.status,
          })}`
    );
    return camelArray<TOrder[]>(response.data);
  },
});

const addOrders = createEvent<TOrder[]>();
const setOrders = createEvent<TOrder[]>();

$orders
  .on(addOrders, (state, orders) => [...state, ...orders])
  .on(setOrders, (_, data) => data)

export const addLocalOrderFx = createEffect<AddLocalOrderRequest, TOrder, Error>({
    name: 'addLocalOrderFx',
    handler: async ({orderId, price}) => {
        const response = await app.post<TOrder>('/orders/add/', {
            orderId,
            price,
        });
        return objectToCamelCase<TOrder>(response?.data!);   
    }
});

export const createOrderFx = createEffect<CreateOrderRequest, CreateOrderResponse, Error>({
  name: 'createOrderFx',
  handler: async ({schedule, paymentData, seats}) => {
    const response = await app.post<CreateOrderResponse>('/orders/create/', {
      schedule,
      seats,
      paymentData,
    });

    return objectToCamelCase<CreateOrderResponse>(response?.data!);
  }
});

export const payOrderFx = createEffect<{paymentId: number}, string, Error>({
  name: 'payOrder',
  handler: async ({paymentId}) => {
    const response = await app.get(`/orders/pay/${paymentId}/`);
    return objectToCamelCase<{redirectUrl: string}>(response.data).redirectUrl;
  }
});

export const printOrderTicketFx = createEffect<{orderId: number}, string, Error>({
  name: "printOrderTicketFx",
  handler: async ({orderId}) => {
    const response = await app.get(`/orders/ticket/${orderId}/`);
    return response.data;
  }
});

export const printOrderReceiptFx = createEffect<{orderId: number}, string, Error>({
  name: "printOrderReceiptFx",
  handler: async ({orderId}) => {
    const response = await app.get(`/orders/receipt/${orderId}/`);
    return response.data;
  }
});

export const refundOrderFx = createEffect<{orderId: number}, TOrder, Error>({
  name: 'refundOrderFx',
  handler: async ({orderId}) => {
    const response = await app.post(`/orders/refund/${orderId}/`);
    return objectToCamelCase<TOrder>(response.data);
  }
});

export const cancelOrderFx = createEffect<{orderId: number}, TOrder, Error>({
  name: 'cancelOrderFx',
  handler: async ({orderId}) => {
    const response = await app.post(`/orders/cancel/${orderId}/`);
    return objectToCamelCase<TOrder>(response.data);
  }
})

export const $ordersLoading = pending([loadUserOrdersFx]);
export const $creationPending = pending([addLocalOrderFx]);


sample({
  clock: cancelOrderFx.doneData,
  target: loadUserOrdersFx,
  fn: (_) => ({}),
});

sample({
  clock: refundOrderFx.doneData,
  target: loadUserOrdersFx,
  fn: (_) => ({}),
});

sample({
  clock: addLocalOrderFx.done,
  target: loadUserOrdersFx,
  fn: () => ({}),
});

sample({
  clock: loadUserOrdersFx.doneData,
  target: $orders,
});
