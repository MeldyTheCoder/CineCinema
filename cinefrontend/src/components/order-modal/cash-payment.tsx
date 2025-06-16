import {
  Center,
  Separator,
  Text,
  Button,
  Flex,
  Card,
  chakra,
  Box,
  List,
} from "@chakra-ui/react";
import { FaTicketAlt } from "react-icons/fa";

type CashPaymentProps = {
  readonly totalPrice: number;
  readonly onSubmit: () => void;
};

const DescriptionCard = chakra(Card.Root, {
  base: {
    borderRadius: "10px",
    flexDirection: "row",
    overflow: "hidden",
    alignItems: "center",
    paddingLeft: "20px",
    maxW: "lg",
    bg: "gray.900",
    _light: {
      bg: 'gray.100',
    }
  },
});

export function CashPayment({ totalPrice, onSubmit }: CashPaymentProps) {
  return (
    <Center flexDirection="column">
      <Flex gap="5" direction="column" alignContent="center">
        <DescriptionCard>
          <Text fontWeight="semibold" fontSize="lg">
            1
          </Text>
          <Box>
            <Card.Body>
              <Card.Title mb="2">Покажите QR-код</Card.Title>
              <Card.Description>
                Подойдите на кассу и предьявите QR-код, который вы получите
                после оплаты.
              </Card.Description>
            </Card.Body>
          </Box>
        </DescriptionCard>

        <DescriptionCard>
          <Text fontWeight="semibold" fontSize="lg">
            2
          </Text>
          <Box>
            <Card.Body>
              <Card.Title mb="2">Оплатите наличными</Card.Title>
              <Card.Description>
                Передайте кассиру деньги (цена билета указана на экране или
                табло).
              </Card.Description>
            </Card.Body>
          </Box>
        </DescriptionCard>

        <DescriptionCard>
          <Text fontWeight="semibold" fontSize="lg">
            3
          </Text>
          <Box>
            <Card.Body>
              <Card.Title mb="2">Пройдите в Ваш зал</Card.Title>
              <Card.Description>
                Получите бумажный билет. Проверьте билет: дата, время, зал и
                места. Приятного проссмотра :)
              </Card.Description>
            </Card.Body>
          </Box>
        </DescriptionCard>
      </Flex>

      <Separator marginY="1rem" />

      <Button borderRadius="15px" onClick={() => onSubmit?.()} width="100%">
        Забронировать за <strong>{Math.round(totalPrice / 100)} ₽</strong>
      </Button>
    </Center>
  );
}
