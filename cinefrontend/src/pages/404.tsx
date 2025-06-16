import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TbMoodEmpty } from "react-icons/tb";

export function Page404() {
  const navigate = useNavigate();

  const handleNavigateToIndex = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <Container
        maxW="container.md"
        centerContent
        height="50vh"
        display="flex"
        justifyContent="center"
      >
        <VStack gap={6} textAlign="center">
          <TbMoodEmpty size={75} />
          <VStack gap={2}>
            <Text fontSize="xl">Страница не найдена</Text>
            <Text color="fg.muted">
              Возможно, эта страница была перемещена или удалена.
            </Text>
          </VStack>

          <Button
            colorPalette="purple"
            borderRadius="md"
            boxShadow="md"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
            onClick={handleNavigateToIndex}
          >
            <FaHome />
            Вернуться на главную
          </Button>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
