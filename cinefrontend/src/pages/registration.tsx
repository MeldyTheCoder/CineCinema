import React, { useEffect, useMemo } from "react";
import { Header } from "../components/header.tsx";
import { useStoreMap } from "effector-react";
import { $tokenData } from "../effector/users.store.ts";
import { Navigate, useSearchParams } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import { RegistrationForm } from "../components/auth/registration-form.tsx";

export function Registration() {
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
        <RegistrationForm />
      </Container>
    </>
  );
}
