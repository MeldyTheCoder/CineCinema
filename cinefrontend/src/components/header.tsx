import {
  Container,
  Tabs,
  Heading,
  Text,
  Flex,
  Input,
  chakra,
  SimpleGrid,
  GridItem,
  Image,
} from "@chakra-ui/react";
import { InputGroup } from "./ui/input-group";
import { Avatar } from "./ui/avatar";
import { IoMdSearch } from "react-icons/io";
import ReactLogo from '../assets/react.svg';

const HeaderTab = chakra(Tabs.Trigger, {
  base: {
    color: "white",
  },
});

const TabText = chakra(
  Text,
  { base: { textTransform: "uppercase" } },
  { defaultProps: { fontSize: "18px" } }
);

const HeaderContainer = chakra(
  Container,
  { base: { marginY: "1rem", alignItems: "center" } },
  {
    defaultProps: { fluid: true },
  }
);

const SiteLogo = chakra(Image, {
  base: { aspectRatio: "1x1", borderRadius: "10px" },
});

const HeaderSearchInput = chakra(
  Input,
  {
    base: {
      borderRadius: "20px",
      width: "100%",
    },
  },
  { defaultProps: { placeholder: "Введите запрос" } }
);

export function Header() {
  return (
    <HeaderContainer animationStyle={{ _open: "slide-fade-in", _closed: "slide-fade-out" }}>
      <SimpleGrid columns={{ base: 10 }}>
        <GridItem
          colSpan={{ base: 2 }}
          display={{ xl: "none", lg: "block" }}
        >
          <SiteLogo src={ReactLogo} />
        </GridItem>
        <GridItem
          colSpan={{ lg: 2, base: 2 }}
          display={{ xl: "flex", lg: "none", sm: "none", md: "none" }}
          gap={5}
          animationStyle={{ _open: "slide-fade-in", _closed: "slide-fade-out" }}
        >
          <SiteLogo src={ReactLogo} />
          <Heading size="3xl">CineCinema</Heading>
        </GridItem>

        <GridItem colSpan={{ lg: 4, md: 3, base: 6 }} marginLeft="auto" width="100%">
          <InputGroup startElement={<IoMdSearch />} width="100%">
            <HeaderSearchInput width="100%" />
          </InputGroup>
        </GridItem>

        <GridItem
          colSpan={{ base: 3 }}
          display={{ lg: "block", sm: "none", base: "none" }}
          marginLeft="auto"
        >
          <Tabs.Root variant="plain" size="lg">
            <Tabs.List>
              <HeaderTab value="0">
                <TabText>Главная</TabText>
              </HeaderTab>

              <HeaderTab value="1">
                <TabText>О Нас</TabText>
              </HeaderTab>

              <HeaderTab value="2">
                <TabText>Контакты</TabText>
              </HeaderTab>
            </Tabs.List>
          </Tabs.Root>
        </GridItem>

        <GridItem marginLeft="auto">
          <Avatar size="xl" />
        </GridItem>
      </SimpleGrid>
    </HeaderContainer>
  );
}
