import { Container, Grid, GridItem } from "@chakra-ui/react";
import { Header } from "../components/header";
import { ProfileSidebar } from "../components/profile/profile-sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useStoreMap } from "effector-react";
import { $tokenData } from "../effector/users.store";
import { stringify } from "qs";

export function ProfileLayout() {
  const isAuthorized = useStoreMap($tokenData, (state) => !!state.accessToken) 

  if (!isAuthorized) {
    const currentUrl = `${window.location.pathname}`;
    return <Navigate to={`/login/?${stringify({next: currentUrl})}`} />
  }

  return (
    <>
      <Header />
      <Container>
        <Grid templateColumns="repeat(6, 1fr)" gap="3rem">
          <GridItem colSpan={1}>
            <ProfileSidebar />
          </GridItem>
          <GridItem colSpan={5}>
            <Outlet />
          </GridItem>
        </Grid>
      </Container>
    </>
  );
}
