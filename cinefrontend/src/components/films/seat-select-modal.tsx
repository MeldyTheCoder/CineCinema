import React, { useEffect, useMemo, useDeferredValue, useState } from "react";
import {
  Badge,
  Button,
  Center,
  CloseButton,
  Dialog,
  Grid,
  GridItem,
  Group,
  Heading,
  Image,
  Portal,
  Separator,
  Stack,
  Status,
  Text,
  useDialog,
} from "@chakra-ui/react";
import { TSchedule, TSeat, TSeatType } from "../../types";
import { useUnit } from "effector-react";
import {
  $seats,
  $seatsLoading,
  loadScheduleSeatsFx,
} from "../../effector/schedule.store";
import { SeatsGrid } from "../seats-grid";
import { getByDayId, getTimeFromSeconds } from "../../utils/dates";
import { TbBuildingPavilion } from "react-icons/tb";
import { filterByUnique, groupByKey } from "../../utils/arrays";

type SeatSelectModalProps = {
  readonly schedule?: TSchedule;
  readonly onSeatSelect: (_: TSeat) => void;
  readonly onClose: () => void;
};

function SeatsPrice({ schedule, seats }: any) {
  const groupedTypes = useMemo(() => {
    const groupedSeats = groupByKey<TSeat>(seats, (seat) => seat.type);
    return Object.entries(groupedSeats)
      .filter(
        ([type]) =>
          ![TSeatType.DISABLED.toString(), TSeatType.VOID.toString()].includes(
            type
          )
      )
      .map(([type, seats]) => ({
        type,
        price: Math.floor(
          schedule.film.price * seats[0].priceFactor * seats[0].hall.priceFactor
        ),
      }));
  }, [schedule, seats]);

  const getColorForType = (type: string) => {
    switch (type) {
      case TSeatType.DISABLED:
        return "red";
      case TSeatType.VIP:
        return "orange";

      case TSeatType.STANDART:
        return "gray";
    }
  };

  return (
    <Group>
      {groupedTypes.map((element) => (
        <Status.Root
          size="lg"
          width="100px"
          colorPalette={getColorForType(element.type)}
        >
          <Status.Indicator />
          {element.price} RUB
        </Status.Root>
      ))}
    </Group>
  );
}
export function SeatSelectModal({
  schedule,
  onSeatSelect,
  onClose,
}: SeatSelectModalProps) {
  const [scheduleCache, setScheduleCache] = useState<TSchedule>(schedule!)

  const dialog = useDialog({
    onOpenChange({open}) {
      if (!open) {
        onClose?.();
      }
    },
  });
  const [seats, loading] = useUnit([$seats, $seatsLoading]);

  useEffect(() => {
    if (!schedule) {
      return;
    }

    loadScheduleSeatsFx({ scheduleId: schedule.id });
  }, [schedule]);

  useEffect(() => {
    if (schedule) {
      setScheduleCache(schedule);
      dialog.setOpen(true);
    } else {
      dialog.setOpen(false);
    }
  }, [schedule]);

  if (!scheduleCache) {
    return null;
  }

  return (
    <Dialog.RootProvider
      size="full"
      motionPreset="slide-in-bottom"
      unmountOnExit
      value={dialog}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Center width="100%">
                <Grid
                  templateColumns="repeat(3, 2fr)"
                  gapX={5}
                  gapY={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <GridItem rowSpan={6} colSpan={1}>
                    <Image
                      src={scheduleCache.film.coverUrl}
                      aspectRatio="1x2"
                      borderRadius="15px"
                      width="125px"
                    />
                  </GridItem>

                  <GridItem colSpan={2} rowSpan={1}>
                    <Text textStyle="xl">{scheduleCache.film.title}</Text>
                  </GridItem>

                  <GridItem colSpan={2} rowSpan={1}>
                    <Text fontSize="25px" fontWeight="bold">
                      {scheduleCache.hall.office.title}
                    </Text>
                  </GridItem>

                  <GridItem colSpan={2} rowSpan={1}>
                    <Group>
                      <Text fontSize="20px" fontWeight="500" textStyle="xl">
                        {`${getByDayId(scheduleCache.dayId, scheduleCache.year).format(
                          "DD MMMM YYYY"
                        )} • ${getTimeFromSeconds(scheduleCache.time)}`}
                      </Text>
                    </Group>
                  </GridItem>

                  <GridItem colSpan={2} rowSpan={1}>
                    <Group>
                      <Badge background="gray.800" borderRadius="lg">
                        {scheduleCache.film.ageRestriction}+
                      </Badge>

                      <Badge colorPalette="purple">
                        <TbBuildingPavilion />
                        <Text fontSize="12px">{scheduleCache.hall.title}</Text>
                      </Badge>
                    </Group>
                  </GridItem>

                  <GridItem colSpan={2} rowSpan={1} paddingTop="10px">
                    <SeatsPrice schedule={scheduleCache} seats={seats} />
                  </GridItem>
                </Grid>
              </Center>
            </Dialog.Header>

            <Separator width="100%" />

            <Dialog.Body marginTop="2rem">
              <SeatsGrid
                seats={seats}
                loading={loading}
                onSeatSelect={onSeatSelect!}
              />
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
}
