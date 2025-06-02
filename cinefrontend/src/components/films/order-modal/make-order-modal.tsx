import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Center,
  CloseButton,
  Dialog,
  Grid,
  GridItem,
  Group,
  Image,
  Portal,
  Separator,
  Status,
  Steps,
  Text,
  useDialog,
  useSteps,
} from "@chakra-ui/react";
import { TSchedule, TSeat, TSeatType } from "../../../types";
import { useUnit } from "effector-react";
import {
  $seats,
  $seatsLoading,
  loadScheduleSeatsFx,
} from "../../../effector/schedule.store";
import { getByDayId, getTimeFromSeconds } from "../../../utils/dates";
import { TbBuildingPavilion } from "react-icons/tb";
import { groupByKey } from "../../../utils/arrays";
import { MdEventSeat } from "react-icons/md";
import { BiSolidSelectMultiple } from "react-icons/bi";
import { TbCreditCardPay } from "react-icons/tb";
import { LuCheck } from "react-icons/lu";
import { SeatSelectStage } from "./seat-select-stage";
import { ConfirmationStage } from "./confirmation-stage";
import { PaymentStage } from "./payment-stage";
import { toaster } from "../../ui/toaster";
import { useForm, useStore } from "@tanstack/react-form";
import { createOrderFx } from "../../../effector/orders.store";

type MakeOrderModalProps = {
  readonly schedule?: TSchedule;
  readonly onClose: () => void;
};

type TOrderFormValues = {
  readonly seats: TSeat[];
  readonly schedule: TSchedule;
  readonly paymentData: any;
};

export const getColorForSeatType = (type: string) => {
  switch (type) {
    case TSeatType.DISABLED:
      return "red";
    case TSeatType.VIP:
      return "orange";

    case TSeatType.STANDART:
      return "gray";
  }
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
          (schedule.film.price *
            seats[0].priceFactor *
            seats[0].hall.priceFactor) /
            100
        ),
      }));
  }, [schedule, seats]);

  return (
    <Group>
      {groupedTypes.map((element) => (
        <Status.Root
          size="lg"
          width="100px"
          colorPalette={getColorForSeatType(element.type)}
        >
          <Status.Indicator />
          {element.price} RUB
        </Status.Root>
      ))}
    </Group>
  );
}

export function MakeOrderModal({ schedule, onClose }: MakeOrderModalProps) {
  const form = useForm({
    defaultValues: {
      seats: [],
      schedule: schedule,
      paymentData: null,
    } as TOrderFormValues,
    onSubmit({value}) {
      handleCreateOrder(value);
    }
  });

  const steps = useSteps({
    defaultStep: 0,
    count: 3,
    linear: true,
    onStepComplete: () => form.handleSubmit(),
  });

  const [seats, loading] = useUnit([$seats, $seatsLoading]);
  const [scheduleCache, setScheduleCache] = useState<TSchedule>(schedule!);

  const dialog = useDialog({
    onOpenChange({ open }) {
      if (!open) {
        onClose?.();
      }
    },
  });

  const handleCreateOrder = ({schedule, seats, paymentData}: TOrderFormValues) => {
    dialog.setOpen(false);
    console.log(schedule, seats, paymentData);
    if (seats.length <= 0 || !scheduleCache || !paymentData) {
      return toaster.create({
        title: "Не удалось создать заказ",
        description: "Повторите попытку позднее.",
      });
    }
    dialog.setOpen(false);
    createOrderFx({
      schedule: schedule.id,
      seats: seats.map((seat_) => seat_.id),
      paymentData,
    }).then((response) => console.log(response));
  };

  const items = [
    {
      key: "seat",
      children: (
        <form.Field name="seats">
          {({ state, handleChange, handleBlur }) => (
            <SeatSelectStage
              initialSeats={state.value}
              schedule={schedule!}
              onComplete={(seats) => {
                handleChange(seats);
                handleBlur();
                steps.goToNextStep();
              }}
            />
          )}
        </form.Field>
      ),
      icon: <MdEventSeat />,
    },
    {
      key: "confirm",
      children: (
        <form.Field name="seats">
          {({ state, handleChange, handleBlur }) => (
            <ConfirmationStage
              schedule={schedule!}
              selectedSeats={state.value}
              onSeatRemove={(seat) => {
                handleChange(
                  state.value.filter((seat_) => seat_.id !== seat.id)
                );
                handleBlur();
              }}
              onComplete={() => {
                steps.goToNextStep();
                handleBlur();
              }}
              onBack={() => {
                steps.goToPrevStep();
                handleBlur();
              }}
            />
          )}
        </form.Field>
      ),
      icon: <BiSolidSelectMultiple />,
    },
    {
      key: "payment",
      children: (
        <form.Field name="paymentData">
          {({ handleChange, handleBlur }) => (
            <PaymentStage
              totalPrice={form.getFieldValue('seats').reduce(
                (acc, value) =>
                  (acc +=
                    value.priceFactor *
                    schedule?.hall.priceFactor! *
                    schedule?.film.price!),
                0
              )}
              onBack={() => steps.goToPrevStep()}
              onComplete={(data) => {
                handleChange(data);
                handleBlur();
                steps.goToNextStep();
              }}
            />
          )}
        </form.Field>
      ),
      icon: <TbCreditCardPay />,
    },
  ];

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
                        {`${getByDayId(
                          scheduleCache.dayId,
                          scheduleCache.year
                        ).format("DD MMMM YYYY")} • ${getTimeFromSeconds(
                          scheduleCache.time
                        )}`}
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

            <Dialog.Body marginTop="2rem" justifyContent="center">
              <Steps.RootProvider value={steps} size={{ base: "xs", md: "sm" }}>
                <Steps.List w={{ base: "100%", md: "50%" }} alignSelf="center">
                  {items.map((step, index) => (
                    <Steps.Item key={index} index={index}>
                      <Steps.Indicator
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Steps.Status
                          incomplete={step.icon}
                          complete={<LuCheck />}
                        />
                      </Steps.Indicator>
                      <Steps.Separator />
                    </Steps.Item>
                  ))}
                </Steps.List>

                <Steps.Content
                  key={items[steps.value]?.key!}
                  index={steps.value}
                >
                  {items[steps.value]?.children! || null}
                </Steps.Content>
              </Steps.RootProvider>
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
