import {
  Button,
  Container,
  Grid,
  GridItem,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Header } from "../components/header";
import {
  ProfileMenuDrawer,
  ProfileSidebar,
} from "../components/profile/profile-sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useStoreMap } from "effector-react";
import { $tokenData } from "../effector/users.store";
import { stringify } from "qs";
import { IoMenu } from "react-icons/io5";

export function ProfileLayout() {
  const breakpoint = useBreakpointValue({
    base: "base",
    lg: "lg",
  });

  const isAuthorized = useStoreMap($tokenData, (state) => !!state.accessToken);

  if (!isAuthorized) {
    const currentUrl = `${window.location.pathname}`;
    return <Navigate to={`/login/?${stringify({ next: currentUrl })}`} />;
  }

  return (
    <>
      <Header
        extraRender={
          breakpoint === "base" && (
            <ProfileMenuDrawer>
              <IconButton variant="ghost">
                <IoMenu />
              </IconButton>
            </ProfileMenuDrawer>
          )
        }
      />
      <Container>
        <Grid templateColumns="repeat(6, 1fr)" gap="3rem">
          <GridItem colSpan={1} display={{ base: "none", lg: "block" }}>
            <ProfileSidebar />
          </GridItem>
          <GridItem colSpan={{ base: 6, lg: 5 }}>
            <Outlet />
          </GridItem>
        </Grid>
      </Container>
    </>
  );
}
