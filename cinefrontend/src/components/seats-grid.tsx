import { Button, chakra, Grid, GridItem, Spinner, Box, VStack } from "@chakra-ui/react";
import { useUnit } from "effector-react";
import {
  $seatsLoading,
  $seats,
  loadScheduleSeatsFx,
} from "../effector/schedule.store";
import { useEffect } from "react";
import { TSeat, TSeatType } from "../types";
import { CinemaScreen } from "./cinema-screen";

const SeatsContainer = chakra(
  Grid,
  {},
  {
    defaultProps: {
      templateColumns: "repeat(20, 1fr)",
      gapY: "10px",
      gapX: "10px",
    },
  }
);

const SeatCell = chakra(
  Button,
  {
    base: {
      borderRadius: "5px",
      width: "2.5rem",
      height: "2.5rem",
      opacity: 0.9,
    },
  },
  { defaultProps: { variant: "surface" } }
);

export const SeatBox = chakra("div", {
  base: {
    borderRadius: "5px",
    minWidth: "2.5rem",
    minHeight: "2.5rem",
  },
});

type SeatProps = {
  readonly seat: TSeat;
  readonly index: number;
};

export function SeatBlock({ type }: { readonly type: TSeat["type"] }) {
  switch (type) {
    case TSeatType.DISABLED:
      return <SeatBox bg="red.500" />;
    case TSeatType.STANDART:
      return <SeatBox bg="gray.800" />;
    case TSeatType.VIP:
      return <SeatBox bg="yellow.900" />;
    default:
      return <div />;
  }
}

export function Seat({ seat, index }: SeatProps) {
  const seatType = seat.isAvailable === false ? TSeatType.DISABLED : seat.type;

  switch (seatType) {
    case TSeatType.VOID:
      return <SeatCell visibility="hidden">{index}</SeatCell>;
    case TSeatType.DISABLED:
      return (
        <SeatCell disabled colorPalette="red">
          {index}
        </SeatCell>
      );
    case TSeatType.STANDART:
      return <SeatCell>{index}</SeatCell>;
    case TSeatType.VIP:
      return <SeatCell colorPalette="yellow">{index}</SeatCell>;
    default:
      return null;
  }
}

type SeatsGridProps = {
  readonly seats: TSeat[];
  readonly loading?: boolean;
  readonly onSeatSelect: (_: TSeat) => void;
};

export function SeatsGrid({ seats, loading, onSeatSelect }: SeatsGridProps) {
  return loading ? (
    <Spinner />
  ) : (
    <VStack gap={1}>
      <CinemaScreen />
      <SeatsContainer>
        {seats
          .sort((prev, next) => prev.row - next.row)
          .map((seat, index) => (
            <GridItem
              gridColumn={seat.column}
              gridRow={seat.row}
              onClick={() => onSeatSelect?.(seat)}
            >
              <Seat seat={seat} index={index + 1} />
            </GridItem>
          ))}
      </SeatsContainer>
    </VStack>
  );
}
