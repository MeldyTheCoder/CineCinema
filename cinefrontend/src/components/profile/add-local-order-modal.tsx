import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  useDialog,
} from "@chakra-ui/react";
import { AddLocalOrderRequest } from "../../effector/orders.store";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useUnit } from "effector-react";
import { $creationPending, addLocalOrderFx } from "../../effector/orders.store";
import { useEffect } from "react";
import { toaster } from "../ui/toaster";

type AddLocalOrderModalProps = {
  readonly children: React.ReactNode;
};

export function AddLocalOrderModal({ children }: AddLocalOrderModalProps) {
  const [loading] = useUnit([$creationPending]);
  const dialog = useDialog();

  const form = useForm<
    Partial<AddLocalOrderRequest>,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >({
    defaultValues: {
      orderId: undefined,
      price: undefined,
    },
    onSubmit({ value }) {
      addLocalOrderFx(value as AddLocalOrderRequest);
      dialog.setOpen(false);
    },
  });

  useEffect(() => {
    const destroySuccessListener = addLocalOrderFx.doneData.watch((order) => {
      toaster.create({
        title: (
          <span>
            Заказ <strong>№{order.id}</strong> успешно добавлен в Ваш личный
            кабинет.
          </span>
        ),
        type: "success",
      });
    });

    const destroyErrorHandler = addLocalOrderFx.failData.watch((error: any) => {
      const errorMessage =
        error?.response?.data?.detail ||
        "Не удалось добавить заказ в личный кабинет.";

      toaster.create({
        title: <span>{errorMessage}</span>,
        type: "error",
      }); 
    });

    return () => {
      destroySuccessListener();
      destroyErrorHandler();
    };
  }, []);

  return (
    <Dialog.RootProvider value={dialog}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="20px">
            <Dialog.Header>
              <Dialog.Title>Добавление покупки из чека</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={5}>
                <form.Field
                  name="orderId"
                  validators={{
                    onBlur: z
                      .number()
                      .int("Значение должно быть целым числом")
                      .positive("Число должно быть положительным."),
                  }}
                >
                  {({ state, handleChange, handleBlur }) => (
                    <Field.Root required>
                      <Field.Label>
                        Номер заказа
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        placeholder="Введите номер заказа"
                        value={state.value}
                        onChange={({ target }) =>
                          handleChange(parseInt(target?.value) || undefined)
                        }
                        onBlur={handleBlur}
                      />
                      <Field.ErrorText>
                        {state.meta.errors[0]?.message}
                      </Field.ErrorText>
                      <Field.HelperText>
                        Номер заказа указан на чеке с покупки
                      </Field.HelperText>
                    </Field.Root>
                  )}
                </form.Field>

                <form.Field
                  name="price"
                  validators={{
                    onBlur: z
                      .number()
                      .positive("Число должно быть положительным."),
                  }}
                >
                  {({ state, handleChange, handleBlur }) => (
                    <Field.Root required>
                      <Field.Label>
                        Стоимость
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        placeholder="Введите стоимость заказа"
                        value={state.value}
                        onChange={({ target }) =>
                          handleChange(parseInt(target?.value) || undefined)
                        }
                        onBlur={handleBlur}
                      />
                      <Field.ErrorText>
                        {state.meta.errors[0]?.message}
                      </Field.ErrorText>
                      <Field.HelperText>
                        Полная стоимость заказа с учетом копеек.
                      </Field.HelperText>
                    </Field.Root>
                  )}
                </form.Field>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Отмена</Button>
              </Dialog.ActionTrigger>
              <Button
                variant="subtle"
                colorPalette="purple"
                loading={loading}
                onClick={() => form.handleSubmit()}
              >
                Добавить
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
}
