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

export function SuccessPayment() {
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
          _open={{animation: "fade-in 500ms ease-out" }}
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
                  <EmptyState.Title>Спасибо за вашу покупку! </EmptyState.Title>
                  <EmptyState.Description maxWidth="75%">
                    Ваш билет уже доступен для печати. Чтобы распечатать его
                    нажмите кнопку <Code>Перейти к заказу</Code>
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
