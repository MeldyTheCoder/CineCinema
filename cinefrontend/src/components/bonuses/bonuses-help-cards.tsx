import { Box, Card, Flex } from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";
import { FaCoins, FaLevelUpAlt, FaTicketAlt } from "react-icons/fa";

export function BonusesHelpCards() {
  const cardBg = useColorModeValue('gray.100', 'gray.900');

  return (
    <Flex justify="space-between" gap={{lg: 5, base: 3}} wrap={{base: "wrap", lg: 'nowrap'}}>
      <Card.Root
        flexDirection="row"
        overflow="hidden"
        maxW="xl"
        w={{base: '100%', lg: 'auto'}}
        alignItems="center"
        paddingLeft="20px"
        bg={cardBg}
      >
        <FaTicketAlt width="100px" />
        <Box>
          <Card.Body>
            <Card.Title mb="2">Много билетов!</Card.Title>
            <Card.Description>
              Каждая покупка билета приносит бонусы!
            </Card.Description>
          </Card.Body>
        </Box>
      </Card.Root>
      <Card.Root
        flexDirection="row"
        overflow="hidden"
        maxW="xl"
        w={{base: '100%', lg: 'auto'}}
        alignItems="center"
        paddingLeft="20px"
        bg={cardBg}
      >
        <FaCoins />
        <Box>
          <Card.Body>
            <Card.Title mb="2">Получайте бонусные монеты</Card.Title>
            <Card.Description>
              10% от суммы заказа — ваши бонусные монеты
            </Card.Description>
          </Card.Body>
        </Box>
      </Card.Root>
      <Card.Root
        flexDirection="row"
        overflow="hidden"
        maxW="xl"
        w={{base: '100%', lg: 'auto'}}
        alignItems="center"
        paddingLeft="20px"
        bg={cardBg}
      >
        <FaLevelUpAlt />
        <Box>
          <Card.Body>
            <Card.Title mb="2">Повышайте уровень</Card.Title>
            <Card.Description>
              Каждые 2 бонуса = 1 очко прогресса в вашем уровне
            </Card.Description>
          </Card.Body>
        </Box>
      </Card.Root>
    </Flex>
  );
}