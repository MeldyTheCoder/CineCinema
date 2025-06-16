import {
  Button,
  ButtonProps,
  Group,
  Menu,
  Portal,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { IoReceiptOutline, IoTicketOutline } from "react-icons/io5";
import { TbCancel, TbCreditCardRefund } from "react-icons/tb";
import { PaymentModal } from "./payment-modal";
import { CiCreditCard1 } from "react-icons/ci";
import { OrderStatuses, TOrder } from "../../types";
import {
  cancelOrderFx,
  printOrderReceiptFx,
  printOrderTicketFx,
  refundOrderFx,
} from "../../effector/orders.store";
import { getByDayId, getTimeFromSeconds } from "../../utils/dates";
import { toaster } from "../ui/toaster";
import { BiFoodMenu } from "react-icons/bi";
import { useColorModeValue } from "../ui/color-mode";

type PurchaseActionButtons = {
  readonly order: TOrder;
};

type TActionButton = {
  readonly colorPalette: ButtonProps["colorPalette"];
  readonly children: React.ReactNode;
  readonly icon: React.ReactNode;
  readonly onClick: (_: TOrder) => void;
};

function EmptyActions() {
  return (
    <Text color="gray.500" fontStyle="revert">
      Нет доступных действий
    </Text>
  );
}

export function PurchaseActionButtons({ order }: PurchaseActionButtons) {
  const buttonBrightness = useColorModeValue("600", "300");

  const breakpointValue = useBreakpointValue({
    lg: "lg",
    base: "base",
  });

  const handleTicketPrint = () => {
    printOrderTicketFx({ orderId: order.id }).then((html) => {
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Билет_${order.schedule.film.title}_${getByDayId(
        order.schedule.dayId,
        order.schedule.year
      ).format("DD-MM-YYYY")}-${getTimeFromSeconds(order.schedule.time)}.html`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    });
  };

  const handleReceiptPrint = () => {
    printOrderReceiptFx({ orderId: order.id }).then((html) => {
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Чек_${order.schedule.film.title}_${getByDayId(
        order.schedule.dayId,
        order.schedule.year
      ).format("DD-MM-YYYY")}-${getTimeFromSeconds(order.schedule.time)}.html`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    });
  };

  const handleRefund = () => {
    refundOrderFx({ orderId: order.id }).then((order) =>
      toaster.create({
        title: "Возврат средств",
        description: (
          <>
            Возврат средств за заказ "{order.schedule.film.title} был успешно
            оформлен.
          </>
        ),
        type: "success",
      })
    );
  };

  const handleCancel = () => {
    cancelOrderFx({ orderId: order.id }).then((order) => {
      toaster.create({
        title: "Отмена заказа",
        description: (
          <>Заказ "{order.schedule.film.title}" был успешно отменен.</>
        ),
        type: "success",
      });
    });
  };

  const actionButtons: TActionButton[] = useMemo(() => {
    const CANCEL: TActionButton = {
      icon: <TbCancel />,
      children: "Отменить",
      onClick: handleCancel,
      colorPalette: "red",
    };

    const PRINT_RECEIPT: TActionButton = {
      icon: <IoReceiptOutline />,
      children: "Распечатать чек",
      onClick: handleReceiptPrint,
      colorPalette: "gray",
    };

    const PRINT_TICKET = {
      colorPalette: "purple",
      onClick: handleTicketPrint,
      icon: <IoTicketOutline />,
      children: "Распечатать билет",
    };

    const REFUND = {
      colorPalette: "orange",
      onClick: handleRefund,
      icon: <TbCreditCardRefund />,
      children: "Оформить возврат",
    };

    const PAY = {
      icon: <CiCreditCard1 />,
      children: (
        <PaymentModal order={order}>
          <Text>Оплатить</Text>
        </PaymentModal>
      ),
      colorPalette: "green",
      onClick: () => null,
    };

    switch (order.status) {
      case OrderStatuses.COMPLETE:
        return [PRINT_RECEIPT, REFUND];
      case OrderStatuses.CANCELED:
        return [];

      case OrderStatuses.NOT_PAID:
        return [PAY, CANCEL];

      case OrderStatuses.POSTPONED:
        return [PRINT_TICKET, PRINT_RECEIPT, REFUND];

      case OrderStatuses.PAID:
        return [PRINT_TICKET, PRINT_RECEIPT, REFUND];

      case OrderStatuses.REFUND:
        return [PRINT_RECEIPT];

      default:
        return [];
    }
  }, [order.status]);

  if (!order) {
    return null;
  }

  if (!actionButtons.length) {
    return <EmptyActions />;
  }

  switch (breakpointValue) {
    case "lg":
      return (
        <Group overflowX="auto">
          {actionButtons.map(({ colorPalette, onClick, icon, children }) => (
            <Button
              key={colorPalette as string}
              variant="subtle"
              colorPalette={colorPalette}
              onClick={() => onClick(order)}
            >
              {icon}
              {children}
            </Button>
          ))}
        </Group>
      );
    default:
      return (
        <Menu.Root size="md" positioning={{ placement: "right-start" }}>
          <Menu.Trigger>
            <Button variant="subtle" colorPalette="purple">
              <BiFoodMenu />
              Действия
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {actionButtons.map(
                  ({ children, icon, colorPalette, onClick }, index) => (
                    <Menu.Item
                      value={`${index}`}
                      onClick={() => onClick(order)}
                      color={`${colorPalette}.${buttonBrightness}`}
                    >
                      {icon}
                      {children}
                    </Menu.Item>
                  )
                )}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      );
  }
}
