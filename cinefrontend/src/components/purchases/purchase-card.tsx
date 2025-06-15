import { useMemo } from "react";
import { OrderStatuses, TOrder } from "../../types";
import {
  cancelOrderFx,
  printOrderReceiptFx,
  printOrderTicketFx,
  refundOrderFx,
} from "../../effector/orders.store";
import { getByDayId, getTimeFromSeconds } from "../../utils/dates";
import { toaster } from "../ui/toaster";
import {
  Badge,
  Box,
  Button,
  Card,
  DataList,
  Flex,
  Group,
  HStack,
  Stack,
  Status,
  VStack,
  Text,
  Image,
  chakra,
  Separator,
} from "@chakra-ui/react";
import { TbCancel, TbCreditCardRefund } from "react-icons/tb";
import { IoReceiptOutline, IoTicketOutline } from "react-icons/io5";
import { CiCreditCard1 } from "react-icons/ci";
import { PaymentModal } from "./payment-modal";
import { Avatar } from "../ui/avatar";
import { parseUrl } from "../../utils/urls";
import { AgeRestrictionBadge, GenresTags } from "../films";
import { SeatCard } from "./seat-card";
import { useColorModeValue } from "../ui/color-mode";

type PurchaseCardProps = {
  readonly order: TOrder;
};

const Divider = chakra(Separator, {
  base: {
    marginY: "1rem",
    width: "100%",
  },
});

const OrderPriceLabel = chakra("span", {
  base: {
    fontStyle: "bold",
    fontSize: "20px",
  },
});

const OrderPositionSpan = chakra(
  "span",
  {
    base: {
      fontSize: "14px",
    },
  },
  {
    defaultProps: {
      color: "gray.500",
    },
  }
);

export function switchOrderStatusesBadgeParams(status: string): [string, string] {
  switch (status) {
    case OrderStatuses.NOT_PAID:
      return ["Ожидает оплаты", "red"];
    case OrderStatuses.PAID:
      return ["Оплачен", "green"];
    case OrderStatuses.CANCELED:
      return ["Отменен", "red"];
    case OrderStatuses.COMPLETE:
      return ["Сеанс завершен", "purple"];

    case OrderStatuses.POSTPONED:
      return ["Сеанс перенесен", "magenta"];

    case OrderStatuses.REFUND:
      return ["Возврат средств", "orange"];

    default:
      return ["Ожидает оплаты", "red"];
  }
}

export function PurchaseCard({ order }: PurchaseCardProps) {
  const orderStatusBadgeBg = useColorModeValue('gray.200', 'gray.800');

  const film = order.schedule.film;

  const statusBadgeParams: [string, string] = useMemo(
    () => switchOrderStatusesBadgeParams(order.status),
    [order.status]
  );

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

  const actionButtons: React.ReactNode[] = useMemo(() => {
    const EMPTY_ACTIONS = (
      <Text color="gray.500" fontStyle="revert">
        Нет доступных действий
      </Text>
    );

    const CANCEL = (
      <Button variant="subtle" colorPalette="red" onClick={handleCancel}>
        <TbCancel />
        Отменить
      </Button>
    );
    const PRINT_RECEIPT = (
      <Button variant="subtle" onClick={handleReceiptPrint}>
        <IoReceiptOutline />
        Распечатать чек
      </Button>
    );
    const PRINT_TICKET = (
      <Button
        colorPalette="purple"
        variant="subtle"
        onClick={handleTicketPrint}
      >
        <IoTicketOutline />
        Распечатать билет
      </Button>
    );
    const REFUND = (
      <Button colorPalette="orange" variant="subtle" onClick={handleRefund}>
        <TbCreditCardRefund />
        Оформить возврат
      </Button>
    );
    const PAY = (
      <PaymentModal order={order}>
        <Button colorPalette="green" variant="subtle">
          <CiCreditCard1 />
          Оплатить
        </Button>
      </PaymentModal>
    );

    switch (order.status) {
      case OrderStatuses.COMPLETE:
        return [PRINT_RECEIPT, REFUND];
      case OrderStatuses.CANCELED:
        return [EMPTY_ACTIONS];

      case OrderStatuses.NOT_PAID:
        return [PAY, CANCEL];

      case OrderStatuses.POSTPONED:
        return [PRINT_TICKET, PRINT_RECEIPT, REFUND];

      case OrderStatuses.PAID:
        return [PRINT_TICKET, PRINT_RECEIPT, REFUND];

      case OrderStatuses.REFUND:
        return [PRINT_RECEIPT];

      default:
        return [EMPTY_ACTIONS];
    }
  }, [order.status]);

  return (
    <Card.Root
      key={order.id}
      width="100%"
      borderRadius="15px"
      flexDirection="row"
    >
      <Image
        src={parseUrl(film.coverUrl)}
        objectFit="cover"
        aspectRatio="1x2"
        width={{ lg: 230, base: 100 }}
        height="inherit"
        borderLeftRadius="15px"
        display={{ base: "none", lg: "flex" }}
      />

      <Box width="100%">
        <Card.Header>
          <Flex alignItems="start" gap={2} direction="column">
            <HStack gap={5} alignItems="start">
              <Avatar
                src={parseUrl(film.coverUrl)}
                width={75}
                height={75}
                display={{ base: "flex", lg: "none" }}
              />
              <VStack gap={2} alignItems="start">
                <Text textStyle="2xl" fontWeight="bold">
                  {film.title}
                </Text>

                <Stack gap={2}>
                  <Stack gap={2} direction="row">
                    {film.genres?.length > 0 && (
                      <GenresTags genres={film.genres!} />
                    )}

                    <AgeRestrictionBadge
                      ageRestriction={film.ageRestriction!}
                    />
                  </Stack>
                </Stack>
              </VStack>
            </HStack>
          </Flex>
        </Card.Header>

        <Divider />

        <Card.Body paddingY={0}>
          <VStack alignItems="start" gap="15px">
            <HStack gapX={10} gapY={5} wrap="wrap">
              <DataList.Root>
                <DataList.Item>
                  <DataList.ItemLabel>Статус</DataList.ItemLabel>
                  <DataList.ItemValue>
                    <Badge bg={orderStatusBadgeBg}>
                      <Status.Root colorPalette={statusBadgeParams[1]}>
                        <Status.Indicator />
                        {statusBadgeParams[0]}
                      </Status.Root>
                    </Badge>
                  </DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>

              <DataList.Root>
                <DataList.Item>
                  <DataList.ItemLabel>Дата сеанса</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {getByDayId(
                      order.schedule.dayId,
                      order.schedule.year
                    ).format("DD.MM.YYYY")}{" "}
                    {getTimeFromSeconds(order.schedule.time)}
                  </DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>

              <DataList.Root>
                <DataList.Item>
                  <DataList.ItemLabel>Филиал</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {order.schedule.hall.office.region.title},{" "}
                    {order.schedule.hall.office.address}
                  </DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>

              <DataList.Root>
                <DataList.Item>
                  <DataList.ItemLabel>Зал</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {order.schedule.hall.title}
                  </DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>
            </HStack>
          </VStack>
        </Card.Body>

        <Divider />

        <Box overflowX="auto" paddingBottom="1px">
          <Group marginX="20px">
            {order.seats.map((seat) => (
              <SeatCard seat={seat} order={order} />
            ))}
          </Group>
        </Box>

        <Divider />

        <Card.Footer justifyContent="space-between">
          <Group>{actionButtons.map((button) => button)}</Group>
          <VStack gap="0px">
            <OrderPriceLabel>{order.price / 100} ₽</OrderPriceLabel>
            <OrderPositionSpan display={{ base: "none", lg: "flex" }}>
              {order.seats.length} шт. x {order.price / 100} ₽
            </OrderPositionSpan>
          </VStack>
        </Card.Footer>
      </Box>
    </Card.Root>
  );
}
