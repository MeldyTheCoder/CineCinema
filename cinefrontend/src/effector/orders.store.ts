import { createEffect, createEvent, createStore, sample, split } from "effector";
import { OrderStatuses, TOrder } from "../types";
import { app } from "../app";
import { camelArray, objectToCamelCase } from "../utils/camelCase";
import { pending } from "patronum";
import { stringify } from "qs";

type LoadUserOrdersRequest = {
  page?: number;
  status?: OrderStatuses | `${OrderStatuses}`;
  search?: string;
};

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

export const $ordersLoading = pending([loadUserOrdersFx]);
export const $creationPending = pending([addLocalOrderFx]);


sample({
  clock: loadUserOrdersFx.doneData,
  target: $orders,
})
