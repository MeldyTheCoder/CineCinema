import {
  Flex,
  Bleed,
  chakra,
  GridItem,
  Link,
  useBreakpoint,
  useBreakpointValue,
  Image,
  Box,
} from "@chakra-ui/react";
import { Avatar } from "./ui/avatar";
import { BsGeoAltFill } from "react-icons/bs";
import { useStoreMap, useUnit } from "effector-react";
import { $tokenData, $user } from "../effector/users.store";
import { $selectedRegion } from "../effector/regions.store";
import { useNavigate } from "react-router-dom";
import { OfficesPopover } from "./regions-popover";
import { useMemo } from "react";
import Logo from "../assets/logo.svg";
import LogoMobile from "../assets/logo-mobile.svg";
import LogoDark from "../assets/logo-dark.svg";
import LogoMobileDark from "../assets/logo-mobile-dark.svg";
import { DarkMode, useColorMode } from "./ui/color-mode";
import { parseUrl } from "../utils/urls";

const HeaderContainer = chakra(
  "div",
  {
    base: {
      padding: { md: "1rem 3rem", sm: "1rem 0" },
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
  readonly extraRender?: React.ReactNode;
};

type HeaderLogoProps = {
  readonly colorMode?: "dark" | "light";
};

export function HeaderLogo({ colorMode }: HeaderLogoProps) {
  const breakpoint = useBreakpointValue({
    base: "base",
    lg: "lg",
  });

  const logo = useMemo(() => {
    switch (colorMode) {
      case "dark":
        return breakpoint === "base" ? LogoMobile : Logo;
      case "light":
        return breakpoint === "base" ? LogoMobileDark : LogoDark;
    }
  }, [colorMode, breakpoint]);

  return (
    <Image
      src={logo}
      width={{ base: "70px", sm: 150, lg: 200 }}
      height={{ base: "70px", sm: 35, lg: 50 }}
      objectFit="cover"
    />
  );
}

export function Header({ transparent, extraRender }: HeaderProps) {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const [selectedRegion] = useUnit([$selectedRegion]);
  const isAuthorized = useStoreMap($tokenData, (state) => !!state.accessToken);
  const [user] = useUnit([$user]);

  const handleLogin = () => {
    navigate("/login/");
  };

  const handleProfileNavigate = () => {
    navigate("/profile/");
  };

  const handleIndexNavigate = () => {
    navigate("/");
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

  const officePopover = (
    <OfficesPopover>
      <Link variant="underline">
        <BsGeoAltFill /> {selectedRegion?.title}
      </Link>
    </OfficesPopover>
  );

  return (
    <HeaderContainer
      animationStyle={{ _open: "slide-fade-in", _closed: "slide-fade-out" }}
      data-status="active"
      paddingY={{ lg: "20px", base: "5px" }}
      paddingX={{ base: "20px", lg: "50px" }}
      {...headerProps}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <GridItem
          colSpan={{ lg: 3, base: 3 }}
          gap={{ lg: 5, base: "3px" }}
          display="flex"
          animationStyle={{
            _open: "slide-fade-in",
            _closed: "slide-fade-out",
          }}
        >
          <div onClick={handleIndexNavigate}>
            <HeaderLogo colorMode={transparent ? "dark" : colorMode} />
          </div>

          {transparent ? (
            <DarkMode>
              {officePopover}
            </DarkMode>
          ) : (
            officePopover
          )}
        </GridItem>

        {isAuthorized && user ? (
          <GridItem colSpan={{ base: 4 }} marginLeft="auto">
            <Avatar
              size="xl"
              onClick={handleProfileNavigate}
              src={parseUrl(user.avatar)}
            />
          </GridItem>
        ) : (
          <GridItem colSpan={{ base: 4 }} marginLeft="auto">
            <Avatar size="xl" onClick={handleLogin} />
          </GridItem>
        )}
        {!!extraRender && <Box marginLeft="7px">{extraRender!}</Box>}
      </Flex>
    </HeaderContainer>
  );
}
