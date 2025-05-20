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
import { useStoreMap, useUnit } from "effector-react";
import { $tokenData, logoutFx, $user } from "../effector/users.store";
import { $selectedRegion } from "../effector/regions.store";
import { useNavigate } from "react-router-dom";
import { OfficesPopover } from "./regions-popover";
import { useMemo } from "react";
import Logo from "../assets/logo.svg";

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
  "div",
  {
    base: {
      padding: {md: "1rem 3rem", sm: '1rem 0'},
      alignItems: "center",
      marginBottom: "1rem",
      _open: { animation: "fade-in 300ms ease-out" },
    },
  },
  {
    defaultProps: {
      "data-state": "open",
    },
  }
);

type HeaderProps = {
  readonly transparent?: boolean;
};

export function HeaderLogo() {
  return (
    <img
      src={Logo}
      style={{ width: "200px", height: "50px", objectFit: "cover" }}
    />
  );
}

export function Header({ transparent }: HeaderProps) {
  const navigate = useNavigate();
  const [selectedRegion] = useUnit([$selectedRegion]);
  const isAuthorized = useStoreMap($tokenData, (state) => !!state.accessToken);
  const [user] = useUnit([$user]);

  const handleLogin = () => {
    navigate("/login/");
  };

  const handleProfileNavigate = () => {
    navigate("/profile/");
  };

  const headerProps = useMemo(() => {
    if (transparent) {
      return {
        position: "absolute",
        bg: "transparent",
        zIndex: 999,
        width: "100%",
      };
    }
    return {};
  }, [transparent]);

  return (
    <Bleed>
      <HeaderContainer
        animationStyle={{ _open: "slide-fade-in", _closed: "slide-fade-out" }}
        data-status="active"
        {...headerProps}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <GridItem
            colSpan={{ lg: 3, base: 3 }}
            gap={5}
            display="flex"
            animationStyle={{
              _open: "slide-fade-in",
              _closed: "slide-fade-out",
            }}
          >
            <HeaderLogo />
            <OfficesPopover>
              <Link variant="underline">
                <BsGeoAltFill /> {selectedRegion?.title}
              </Link>
            </OfficesPopover>
          </GridItem>

          {isAuthorized && user ? (
            <GridItem colSpan={{ base: 4 }} marginLeft="auto">
              <Avatar
                size="xl"
                onClick={handleProfileNavigate}
                src={`http://localhost:8080/media/${user.avatar}`}
              />
            </GridItem>
          ) : (
            <GridItem colSpan={{ base: 4 }} marginLeft="auto">
              <Avatar
                size="xl"
                onClick={handleLogin}
              />
            </GridItem>
          )}
        </Flex>
      </HeaderContainer>
    </Bleed>
  );
}
