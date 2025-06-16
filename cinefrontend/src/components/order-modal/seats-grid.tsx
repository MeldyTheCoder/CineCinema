import {
  AbsoluteCenter,
  Button,
  chakra,
  Grid,
  GridItem,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { TSeat, TSeatType } from "../../types";
import { CinemaScreen } from "./cinema-screen";
import { FaCheck } from "react-icons/fa";
import { lightenHexColor, darkenHexColor } from "../../utils/colors";

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
  readonly selected?: boolean;
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

export function Seat({ seat, index, selected }: SeatProps) {
  const seatType = seat.isAvailable === false ? TSeatType.DISABLED : seat.type;
  const cellContent = selected ? <FaCheck /> : index.toString();

  const generatePropsForColor = (color: string) => {
    return {
      bg: lightenHexColor(color, 30),
      color: darkenHexColor(color, 50),
      borderColor: darkenHexColor(color, 80),
    }
  }
  const seatProps = useMemo(() => {
    switch (seatType) {
      case TSeatType.VOID:
        return {
          visibility: "hidden",
          children: cellContent,
        };
      case TSeatType.DISABLED:
        return {
          disabled: true,
          children: cellContent,
          colorPalette: "red",
        };
      case TSeatType.STANDART:
        return {
          colorPalette: "gray",
          children: cellContent,
        };
      case TSeatType.VIP:
        return {
          colorPalette: 'yellow',
          children: cellContent,
        };
      default:
        return null;
    }
  }, [seat, selected]);

  return <SeatCell {...seatProps} />;
}

type SeatsGridProps = {
  readonly seats: TSeat[];
  readonly selected?: TSeat[];
  readonly loading?: boolean;
  readonly onSeatSelect: (_: TSeat) => void;
};

export function SeatsGrid({
  seats,
  selected,
  loading,
  onSeatSelect,
}: SeatsGridProps) {
  const isSelected = useCallback<(_: TSeat) => boolean>(
    (seat: TSeat) => {
      return !!selected?.find((seat_) => seat.id === seat_.id);
    },
    [selected]
  );

  return loading ? (
    <AbsoluteCenter>
      <Spinner />
    </AbsoluteCenter>
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
              <Seat seat={seat} index={index + 1} selected={isSelected(seat)} />
            </GridItem>
          ))}
      </SeatsContainer>
    </VStack>
  );
}
