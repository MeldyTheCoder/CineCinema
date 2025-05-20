import React, { useEffect, useMemo } from "react";
import { Header } from "../components/header";
import { LoginForm } from "../components/login-form";
import { useStoreMap } from "effector-react";
import { $tokenData } from "../effector/users.store.ts";
import { Navigate, useSearchParams } from "react-router-dom";
import { Container } from "@chakra-ui/react";

export function Login() {
  const [params] = useSearchParams();
  const isAuthorized = useStoreMap($tokenData, (state) => !!state.accessToken);

  const fallbackUrl = useMemo(() => {
    return params.get('next')
  }, [params]);

  if (isAuthorized) {
    return <Navigate to={fallbackUrl ? fallbackUrl : "/"} />;
  }

  return (
    <>
      <Header />
      <Container>
        <LoginForm />
      </Container>
    </>
  );
}
