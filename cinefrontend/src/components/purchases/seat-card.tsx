import { Badge, Card, Flex, Text, } from "@chakra-ui/react";
import { TOrder, TSeat, TSeatType } from "../../types";
import { FaCrown } from "react-icons/fa";

type SeatCardProps = {
    readonly seat: TSeat;
    readonly order: TOrder;
}

function switchSeatBadgeByType(type: TSeatType) {
  const commonProps = {
    width: "100%",
    borderTopRadius: "10px",
    borderBottomRadius: "0",
  };

  switch (type) {
    case TSeatType.STANDART:
      return (
        <Badge colorPalette="gray" {...commonProps}>
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

export function SeatCard({
  seat,
  order,
}: SeatCardProps) {
  return (
    <Card.Root gap="1px" borderRadius="10px" variant="elevated">
      <Card.Header padding={0}>{switchSeatBadgeByType(seat.type)}</Card.Header>

      <Flex
        gap="2px"
        paddingX="10px"
        paddingY="5px"
        direction="column"
        align="center"
      >
        <Text fontStyle="xs">
          {seat.verboseName}
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