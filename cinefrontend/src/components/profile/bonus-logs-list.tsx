import {
  Card,
  For,
  Group,
  Text,
  Stack,
  VStack,
  Image,
  Flex,
  Box,
} from "@chakra-ui/react";
import { TBonusLog } from "../../types";
import { Avatar } from "../ui/avatar";
import { FaCoins, FaLevelUpAlt, FaTicketAlt } from "react-icons/fa";
import { parseUrl } from "../../utils/urls";
import { useColorModeValue } from "../ui/color-mode";

type BonusLogCardProps = {
  readonly log: TBonusLog;
};

function switchLogType(type: TBonusLog["type"]) {
  switch (type) {
    case "deposit":
      return "Покупка билета";

    case "withdrawal":
      return "Оплата билета";

    default:
      return "";
  }
}

function renderLogPrice(log: TBonusLog) {
  const data = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(log.bonuses / 100);

  switch (log.type) {
    case "withdrawal":
      return (
        <Text color="red.400" fontSize="20px" fontWeight="bold">
          -{data}
        </Text>
      );
    case "deposit":
      return (
        <Text color="green.400" fontSize="20px" fontWeight="bold">
          +{data}
        </Text>
      );
    default:
      return null;
  }
}
export function BonusLogCard({ log }: BonusLogCardProps) {
  return (
    <Card.Root width="100%" borderRadius="15px" padding="10px">
      <Flex justify="space-between">
        <Group>
          <Avatar src={parseUrl(log.order.schedule.film.coverUrl)} width={70} height={70} />
          <VStack gap={0} alignItems="start">
            <Text textStyle="lg">{log.order.schedule.film.title}</Text>
            <Text textStyle="sm" color="gray.400">
              {switchLogType(log.type)}
            </Text>
          </VStack>
        </Group>

        <VStack gap={0} justify="center" align="end">
          {renderLogPrice(log)}
          <Text fontSize="12px" color="gray.500">
            +{(log.bonuses / 100) * 2} XP
          </Text>
        </VStack>
      </Flex>
    </Card.Root>
  );
}
