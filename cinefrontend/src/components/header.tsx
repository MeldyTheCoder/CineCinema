import {
  Container,
  Tabs,
  Heading,
  Text,
  Flex,
  Input,
  Bleed,
  Card,
  chakra,
  SimpleGrid,
  GridItem,
  Link,
  Image,
  Button,
} from "@chakra-ui/react";
import { Avatar } from "./ui/avatar";
import { BsGeoAltFill } from "react-icons/bs";
import ReactLogo from "../assets/react.svg";
import { useStoreMap, useUnit } from "effector-react";
import { $tokenData, logoutFx } from "../effector/users.store";
import { $selectedRegion } from "../effector/regions.store";
import { useNavigate } from "react-router-dom";
import { OfficesPopover } from "./regions-popover";

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

const HeaderContainer = chakra("div", {
  base: { padding: "1rem 3rem", alignItems: "center", marginBottom: "1rem" },
});

const SiteLogo = chakra(Image, {
  base: { aspectRatio: "1x1", borderRadius: "10px" },
});

export function Header() {
  const navigate = useNavigate();
  const [selectedRegion] = useUnit([$selectedRegion]);
  const isAuthorized = useStoreMap($tokenData, (state) => !!state.accessToken);

  const handleLogin = () => {
    navigate("/login/");
  };

  const handleLogout = () => {
    logoutFx().then(() => navigate("/"));
  };

  return (
    <Bleed>
      <HeaderContainer
        animationStyle={{ _open: "slide-fade-in", _closed: "slide-fade-out" }}
        data-status="active"
      >
        <SimpleGrid columns={{ base: 10 }}>
          <GridItem colSpan={{ base: 2 }} display={{ xl: "none", lg: "block" }}>
            <SiteLogo src={ReactLogo} />
          </GridItem>
          <GridItem
            colSpan={{ lg: 3, base: 3 }}
            display={{ xl: "flex", lg: "none", sm: "none", md: "none" }}
            gap={5}
            animationStyle={{
              _open: "slide-fade-in",
              _closed: "slide-fade-out",
            }}
          >
            <SiteLogo src={ReactLogo} />

            <Heading size="3xl">CineCinema</Heading>

            <OfficesPopover>
              <Link variant="underline">
                <BsGeoAltFill /> {selectedRegion?.title}
              </Link>
            </OfficesPopover>
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

          {isAuthorized ? (
            <GridItem colSpan={{ base: 4 }} marginLeft="auto">
              <Avatar size="xl" onClick={handleLogout} />
            </GridItem>
          ) : (
            <GridItem colSpan={{ base: 4 }} marginLeft="auto">
              <Button colorPalette="cyan" size="lg" onClick={handleLogin}>
                Войти
              </Button>
            </GridItem>
          )}
        </SimpleGrid>
      </HeaderContainer>
    </Bleed>
  );
}
