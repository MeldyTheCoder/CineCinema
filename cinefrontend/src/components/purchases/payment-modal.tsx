import React from "react";
import { TOrder } from "../../types";
import { Dialog, Portal, QrCode, Text, CloseButton } from "@chakra-ui/react";

type PaymentModalProps = {
  readonly order: TOrder;
  readonly children: React.ReactNode;
};

export function PaymentModal({ order, children }: PaymentModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Оплата заказа №{order.id}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body
              justifyContent="center"
              alignItems="center"
              display="flex"
              flexDirection="column"
              gap={5}
            >
              <QrCode.Root
                value={JSON.stringify({ orderId: order.id })}
                size="2xl"
              >
                <QrCode.Frame>
                  <QrCode.Pattern />
                </QrCode.Frame>
              </QrCode.Root>
              <Text textStyle="lg">
                Покажите этот QR-код на кассе кинотеатра
              </Text>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
