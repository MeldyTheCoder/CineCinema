import {
  Card,
  For,
  Flex,
  Spinner,
  Separator,
  VStack,
  Box,
  Wrap,
  Group,
  Center,
  Button,
  Input,
  SegmentGroup,
  chakra,
} from "@chakra-ui/react";
import { useUnit } from "effector-react";
import {
  $orders,
  $ordersLoading,
  addLocalOrderFx,
  loadUserOrdersFx,
} from "../../effector/orders.store";
import { useEffect, useMemo, useState } from "react";
import { OrderStatuses } from "../../types.ts";
import { LuSearch } from "react-icons/lu";
import { InputGroup } from "../../components/ui/input-group.tsx";
import { FaPlus } from "react-icons/fa6";
import { AddLocalOrderModal } from "../../components/profile/add-local-order-modal.tsx";
import { PurchaseCard, switchOrderStatusesBadgeParams, PurchasesEmptyState } from "../../components/purchases";

const SegmentGroupIndicator = chakra(SegmentGroup.Indicator, {
  base: {
    _light: {
      bg: 'gray.200',
    }
  }
})

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
        <Card.Root
          borderRadius="15px"
          width="100%"
          padding={{ lg: "30px", base: "10px" }}
        >
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

            <Box overflowX="auto" width="100%">
              <SegmentGroup.Root
                value={status}
                onValueChange={(value) => setStatus(value.value)}
              >
                <SegmentGroupIndicator />
                <SegmentGroup.Items items={orderStatusesItems} />
              </SegmentGroup.Root>
            </Box>
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
          <For each={orders} fallback={<PurchasesEmptyState />}>
            {(order) => <PurchaseCard order={order} />}
          </For>
        )}
      </VStack>
    </Flex>
  );
}
