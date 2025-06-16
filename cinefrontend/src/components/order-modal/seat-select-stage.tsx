import { useUnit } from "effector-react";
import { useMemo, useState } from "react";
import {
  $seats,
  $seatsLoading,
  checkSeatsAvailabilityFx,
} from "../../effector/schedule.store";
import { TSeat, TSchedule } from "../../types";
import { toaster } from "../ui/toaster";
import { ActionBar, Button, Flex, Portal, Text } from "@chakra-ui/react";
import { SeatsGrid } from "./seats-grid";
import { GrNext } from "react-icons/gr";

const MAX_SEATS_PER_ORDER = 4;

type SeatSelectStageProps = {
  readonly initialSeats?: TSeat[];
  readonly schedule: TSchedule;
  readonly onComplete: (_: TSeat[]) => void;
};

export function SeatSelectStage({
  initialSeats,
  schedule,
  onComplete,
}: SeatSelectStageProps) {
  const [selectedSeats, setSelectedSeats] = useState<TSeat[]>(
    initialSeats || []
  );
  const [seats, loading] = useUnit([$seats, $seatsLoading]);

  const selectedSeatsSum = useMemo<number>(() => {
    const filmPrice = schedule?.film.price || 0;
    const hallPriceFactor = schedule?.hall.priceFactor || 1;

    return selectedSeats.reduce(
      (acc, value) => (acc += value.priceFactor * filmPrice * hallPriceFactor),
      0
    );
  }, [selectedSeats, schedule]);

  const handleSeatSelect = (seat: TSeat) => {
    setSelectedSeats((prev: TSeat[]) => {
      const seatExists = prev.find((seat_) => seat_.id === seat.id);
      if (seatExists) {
        return prev.filter((seat_) => seat_.id !== seat.id);
      }
      if (prev.length >= MAX_SEATS_PER_ORDER) {
        toaster.create({
          type: "error",
          title: "Что-то пошло не по плану ;(",
          description: `К сожалению, за один раз можно забронировать не более ${MAX_SEATS_PER_ORDER} мест.`,
        });
        return prev;
      }
      return [...prev, seat];
    });
  };

  const handleComplete = () => {
    checkSeatsAvailabilityFx({
      scheduleId: schedule.id,
      seats: selectedSeats.map((seat) => seat.id),
    })
      .then(() => onComplete?.(selectedSeats))
      .catch(() => {
        toaster.create({
          type: "error",
          title: "Что-то пошло не по плану ;(",
          description: `К сожалению, некоторые из выбранных Вами мест оказались занятыми.`,
        });
      });
  };

  return (
    <Flex direction="column" gap={10}>
      <SeatsGrid
        seats={seats}
        loading={loading}
        selected={selectedSeats}
        onSeatSelect={handleSeatSelect}
      />
      <ActionBar.Root
        open={selectedSeats.length > 0}
        closeOnInteractOutside={false}
      >
        <Portal>
          <ActionBar.Positioner zIndex={2000}>
            <ActionBar.Content
              colorPalette="purple"
              scale={{ base: "1", lg: "1.2" }}
            >
              <ActionBar.SelectionTrigger>
                {selectedSeats.length} выбрано
              </ActionBar.SelectionTrigger>

              <ActionBar.Separator />

              <ActionBar.SelectionTrigger>
                <Text fontWeight="semibold" fontSize="16px">
                  {Math.round(selectedSeatsSum / 100)} ₽
                </Text>
              </ActionBar.SelectionTrigger>

              <ActionBar.Separator />

              <Button
                variant="outline"
                size="xs"
                onClick={handleComplete}
                disabled={selectedSeats.length <= 0}
              >
                <GrNext />
                Продолжить
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </Flex>
  );
}
