import {
  Card,
  chakra,
  For,
  EmptyState,
  Flex,
  Spinner,
  Separator,
  Text,
  VStack,
  HStack,
  Image,
  Stack,
  Box,
  Wrap,
  Badge,
  Group,
  Center,
  Status,
  Button,
  DataList,
  Input,
  SegmentGroup,
  Bleed,
} from "@chakra-ui/react";
import { useUnit } from "effector-react";
import {
  $orders,
  $ordersLoading,
  addLocalOrderFx,
  AddLocalOrderRequest,
  loadUserOrdersFx,
} from "../../effector/orders.store";
import { useEffect, useMemo, useState } from "react";
import { getByDayId, getTimeFromSeconds } from "../../utils/dates";
import { LuShoppingCart } from "react-icons/lu";
import { GenresTags } from "../../components/films/genres-tags";
import { OrderStatuses, TOrder, TSeat, TSeatType } from "../../types.ts";
import { IoTicketOutline, IoReceiptOutline } from "react-icons/io5";
import { TbCancel, TbCreditCardRefund } from "react-icons/tb";
import { CiCreditCard1 } from "react-icons/ci";
import { LuSearch } from "react-icons/lu";
import { InputGroup } from "../../components/ui/input-group.tsx";
import { FaPlus } from "react-icons/fa6";
import { AddLocalOrderModal } from "../../components/profile/add-local-order-modal.tsx";
import { toaster } from "../../components/ui/toaster.tsx";
import { FaCrown } from "react-icons/fa";

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

function switchSeatBadgeByType(type: TSeatType) {
  const commonProps = {
    width: '100%',
    borderTopRadius: '10px',
    borderBottomRadius: '0',
  };

  switch (type) {
    case TSeatType.STANDART:
      return (
        <Badge colorPalette="gray" {...commonProps} bg="gray.800">
          <FaCrown />
          STANDART
        </Badge>
      );
    case TSeatType.VIP:
      return (
        <Badge colorPalette="orange" {...commonProps}>
          <FaCrown />
          VIP
        </Badge>
      );
    default:
      return null;
  }
}
function switchOrderStatusesBadgeParams(status: string): [string, string] {
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

function OrdersEmptyState() {
  return (
    <Card.Root width="100%" height="100%">
      <Card.Body>
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuShoppingCart />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>У Вас еще не было покупок</EmptyState.Title>
              <EmptyState.Description>
                Выберите фильм по душе и бегом покупать попкорн :)
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      </Card.Body>
    </Card.Root>
  );
}

export function SeatCard({
  seat,
  order,
}: {
  readonly seat: TSeat;
  readonly order: TOrder;
}) {
  return (
    <Card.Root gap="1px" borderRadius="10px" variant="elevated">
      <Card.Header padding={0}>{switchSeatBadgeByType(seat.type)}</Card.Header>

      <Flex gap="2px" paddingX="10px" paddingY="5px" direction="column" align="center">
        <Text fontStyle="xs">
          {seat.row} ряд {seat.column} место
        </Text>

        <Text fontStyle="sm" fontWeight="semibold">
          {(seat.priceFactor *
            order.schedule.hall.priceFactor *
            order.schedule.film.price) /
            100}{" "}
          ₽
        </Text>
      </Flex>
    </Card.Root>
  );
}
export function OrderCard({ order }: { readonly order: TOrder }) {
  const film = order.schedule.film;

  const statusBadgeParams: [string, string] = useMemo(
    () => switchOrderStatusesBadgeParams(order.status),
    [order.status]
  );

  const actionButtons: React.ReactNode[] = useMemo(() => {
    const CANCEL = (
      <Button variant="subtle" colorPalette="red">
        <TbCancel />
        Отменить
      </Button>
    );
    const PRINT_RECEIPT = (
      <Button variant="subtle">
        <IoReceiptOutline />
        Распечатать чек
      </Button>
    );
    const PRINT_TICKET = (
      <Button colorPalette="purple" variant="subtle">
        <IoTicketOutline />
        Распечатать билет
      </Button>
    );
    const REFUND = (
      <Button colorPalette="orange" variant="subtle">
        <TbCreditCardRefund />
        Оформить возврат
      </Button>
    );
    const PAY = (
      <Button colorPalette="green" variant="subtle">
        <CiCreditCard1 />
        Оплатить
      </Button>
    );

    switch (order.status) {
      case OrderStatuses.COMPLETE:
        return [PRINT_RECEIPT, REFUND];
      case OrderStatuses.CANCELED:
        return [REFUND];

      case OrderStatuses.NOT_PAID:
        return [PAY, CANCEL];

      case OrderStatuses.POSTPONED:
        return [PRINT_TICKET, PRINT_RECEIPT, CANCEL];

      case OrderStatuses.PAID:
        return [PRINT_TICKET, PRINT_RECEIPT, CANCEL];

      case OrderStatuses.REFUND:
        return [PRINT_RECEIPT];

      default:
        return [];
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
        src={film.coverUrl}
        objectFit="cover"
        aspectRatio="1x2"
        width={230}
        height="inherit"
        borderLeftRadius="15px"
      />

      <Box width="100%">
        <Card.Header>
          <Flex alignItems="start" gap={2} direction="column">
            <HStack gap={5} alignItems="start">
              <VStack gap={2} alignItems="start">
                <Text textStyle="2xl" fontWeight="bold">
                  {film.title}
                </Text>

                <Stack gap={2}>
                  <Stack gap={2} direction="row">
                    {film.genres?.length > 0 && (
                      <GenresTags genres={film.genres!} />
                    )}

                    <Badge background="gray.800" borderRadius="lg">
                      {film.ageRestriction}+
                    </Badge>
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
              <DataList.Root size="md">
                <DataList.Item>
                  <DataList.ItemLabel>Статус</DataList.ItemLabel>
                  <DataList.ItemValue>
                    <Badge bg="gray.800">
                      <Status.Root colorPalette={statusBadgeParams[1]}>
                        <Status.Indicator />
                        {statusBadgeParams[0]}
                      </Status.Root>
                    </Badge>
                  </DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>

              <DataList.Root size="md">
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

              <DataList.Root size="md">
                <DataList.Item>
                  <DataList.ItemLabel>Филиал</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {order.schedule.hall.office.region.title},{" "}
                    {order.schedule.hall.office.address}
                  </DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>

              <DataList.Root size="md">
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

        <Group marginX="20px">
          {order.seats.map((seat) => (
            <SeatCard seat={seat} order={order} />
          ))}
        </Group>

        <Divider />
 
        <Card.Footer justifyContent="space-between">
          <Group>{actionButtons.map((button) => button)}</Group>
          <VStack gap="0px">
            <OrderPriceLabel>{order.price / 100} ₽</OrderPriceLabel>
            <OrderPositionSpan>
              {order.seats.length} шт. x {order.price / 100} ₽
            </OrderPositionSpan>
          </VStack>
        </Card.Footer>
      </Box>
    </Card.Root>
  );
}
export function ProfilePurchases() {
  const [orders, loading] = useUnit([$orders, $ordersLoading]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [status, setStatus] = useState<string>("all");

  const orderStatusesItems = useMemo(
    () => [
      {
        label: "Все",
        value: "all",
      },
      ...Object.values(OrderStatuses).map((value) => {
        const label = switchOrderStatusesBadgeParams(value)[0];
        return {
          label,
          value: value.toString(),
        };
      }),
    ],
    []
  );

  useEffect(() => {
    const completeStatus = status === "all" ? undefined : status;

    const destroySuccessHandler = addLocalOrderFx.doneData.watch(() => {
      loadUserOrdersFx({ page, search, status: completeStatus as any });
    });

    return () => destroySuccessHandler();
  }, []);

  useEffect(() => {
    const completeStatus = status === "all" ? undefined : status;
    loadUserOrdersFx({ page, search, status: completeStatus as any });
  }, [search, page, status]);

  return (
    <Flex gap="20px">
      <VStack gap={5} width="100%">
        <Card.Root borderRadius="15px" width="100%" padding="30px">
          <Wrap gap={5} direction="row">
            <Group width="100%">
              <InputGroup startElement={<LuSearch />} flex="1">
                <Input
                  placeholder="Поиск по названию фильма"
                  onBlur={({ target }) => setSearch(target?.value)}
                />
              </InputGroup>

              <AddLocalOrderModal>
                <Button
                  variant="subtle"
                  colorPalette="purple"
                  borderRadius="10px"
                >
                  <FaPlus />
                  Добавить
                </Button>
              </AddLocalOrderModal>
            </Group>

            <SegmentGroup.Root
              value={status}
              onValueChange={(value) => setStatus(value.value)}
            >
              <SegmentGroup.Indicator />
              <SegmentGroup.Items items={orderStatusesItems} />
            </SegmentGroup.Root>
          </Wrap>
        </Card.Root>

        <Separator width="100%" />

        {loading ? (
          <Box width="100%" height="400px">
            <Center>
              <Spinner />
            </Center>
          </Box>
        ) : (
          <For each={orders} fallback={<OrdersEmptyState />}>
            {(order) => <OrderCard order={order} />}
          </For>
        )}
      </VStack>
    </Flex>
  );
}
