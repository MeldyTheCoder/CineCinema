import {
  AbsoluteCenter,
  Box,
  Button,
  Code,
  Container,
  EmptyState,
  Group,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { Header } from "../components/header";
import { useNavigate } from "react-router-dom";

export function CashPaymentInstructions() {
  const navigate = useNavigate();

  const handleNavigateIndex = () => {
    navigate("/");
  };

  const handleNavigateOrders = () => {
    navigate("/profile/purchases/");
  };

  return (
    <>
      <Header />
      <Container>
        <Box
          width="100%"
          height="600px"
          position="relative"
          _open={{ animation: "fade-in 500ms ease-out" }}
          animationStyle={{ _open: "slide-fade-in", _closed: "slide-fade-out" }}
          data-status="active"
          data-state="open"
        >
          <AbsoluteCenter axis="both">
            <EmptyState.Root size="lg">
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <Icon color="green.500">
                    <FaCheckCircle />
                  </Icon>
                </EmptyState.Indicator>
                <VStack textAlign="center" gap={5}>
                  <EmptyState.Title>
                    Бронирование успешно завершено!{" "}
                  </EmptyState.Title>
                  <EmptyState.Description maxWidth="75%">
                    Ваш билет будет доступен сразу после оплаты наличными. Чтобы
                    оплатить Ваш заказ на кассе, нажмите на кнопку{" "}
                    <Code>Перейти к заказу</Code> или перейдите в Ваш личный
                    кабинет, и нажмите кнопку <Code>Оплатить</Code> на карточке заказа.
                  </EmptyState.Description>

                  <Group>
                    <Button
                      variant="subtle"
                      colorPalette="purple"
                      borderRadius="10px"
                      onClick={handleNavigateOrders}
                    >
                      Перейти к заказу
                    </Button>
                    <Button
                      variant="subtle"
                      borderRadius="10px"
                      onClick={handleNavigateIndex}
                    >
                      На главную
                    </Button>
                  </Group>
                </VStack>
              </EmptyState.Content>
            </EmptyState.Root>
          </AbsoluteCenter>
        </Box>
      </Container>
    </>
  );
}
