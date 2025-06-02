import {
  Badge,
  Button,
  Center,
  chakra,
  Flex,
  FormatNumber,
  Group,
  Stat,
  Table,
} from "@chakra-ui/react";
import { TSeat, TSchedule, TSeatType } from "../../../types";
import { useMemo } from "react";
import { TiDeleteOutline } from "react-icons/ti";

const SeatsSumaryContainer = chakra("div", {
  base: {
    marginTop: "2rem",
    width: { base: "100%", lg: "50%" },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "2rem",
  },
});

type SeatsConfirmationStageProps = {
  readonly schedule: TSchedule;
  readonly selectedSeats: TSeat[];
  readonly onComplete?: () => void;
  readonly onBack?: () => void;
  readonly onSeatRemove: (_: TSeat) => void;
};

export function ConfirmationStage({
  schedule,
  selectedSeats,
  onBack,
  onSeatRemove,
  onComplete,
}: SeatsConfirmationStageProps) {
  const getBadgeBySeatType = (seat: TSeat) => {
    switch (seat.type) {
      case TSeatType.VIP:
        return <Badge colorPalette="orange">VIP</Badge>;
      case TSeatType.STANDART:
        return <Badge colorPalette="gray">STANDART</Badge>;
    }
  };

  const selectedSeatsSum = useMemo<number>(() => {
    const filmPrice = schedule?.film.price || 0;
    const hallPriceFactor = schedule?.hall.priceFactor || 1;

    return selectedSeats.reduce(
      (acc, value) => (acc += value.priceFactor * filmPrice * hallPriceFactor),
      0
    );
  }, [selectedSeats, schedule]);

  return (
    <Center>
      <SeatsSumaryContainer>
        <Table.Root
          size={{ base: "sm", lg: "lg" }}
          variant="outline"
          native
          borderRadius="15px"
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Зал</Table.ColumnHeader>
              <Table.ColumnHeader>Ряд и место</Table.ColumnHeader>
              <Table.ColumnHeader>Тип</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Цена</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Действие</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {selectedSeats.map((seat) => (
              <Table.Row
                key={seat.id}
                bg="transparent"
                borderLeftColor={(() => {
                  switch (seat.type) {
                    case TSeatType.VIP:
                      return "orange";
                    case TSeatType.STANDART:
                      return "gray";
                    default:
                      return undefined;
                  }
                })()}
              >
                <Table.Cell>{schedule.hall?.title}</Table.Cell>
                <Table.Cell>
                  {seat.row} ряд {seat.column} место
                </Table.Cell>
                <Table.Cell>{getBadgeBySeatType(seat)}</Table.Cell>
                <Table.Cell textAlign="end">
                  {Math.round(
                    (schedule.hall.priceFactor *
                      seat.priceFactor *
                      schedule.film.price) /
                      100
                  )}{" "}
                  ₽
                </Table.Cell>
                <Table.Cell textAlign="end">
                  <Button
                    variant="ghost"
                    colorPalette="red"
                    onClick={() => onSeatRemove?.(seat)}
                  >
                    <TiDeleteOutline />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        <Flex justify="space-between" align="center" marginX="5px">
          <Group gap={2}>
            <Stat.Root size={{base: "sm", lg: 'md'}}>
              <Stat.Label>Итого</Stat.Label>
              <Stat.ValueText>
                {" "}
                <FormatNumber
                  value={Math.round(selectedSeatsSum / 100)}
                  style="currency"
                  currency="RUB"
                />
              </Stat.ValueText>
            </Stat.Root>
          </Group>

          <Group>
            <Button variant="outline" onClick={() => onBack?.()}>
              Назад
            </Button>
            <Button onClick={() => onComplete?.()}>Да, все верно</Button>
          </Group>
        </Flex>
      </SeatsSumaryContainer>
    </Center>
  );
}
