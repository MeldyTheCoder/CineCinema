import {
  Image,
  Stack,
  Field,
  Input,
  Flex,
  Button,
  Separator,
  Text,
  Link,
  Heading,
  usePinInput,
  Code,
  useSteps,
} from "@chakra-ui/react";
import ReactSVG from "../../assets/react.svg";
import { AuthFormContainer, FormStageProps } from "./auth-form-container";
import { useForm } from "@tanstack/react-form";
import { TUser } from "../../types";
import {
  IoCreateOutline,
  IoLogInOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  registerSmsFx,
  sendAuthCodeFx,
  sendRegistrationCodeFx,
} from "../../effector/users.store";
import { CodeInputStage } from "./code-stage";
import { RegistrationPhoneStage } from "./phone-input-stage";
import { toaster } from "../ui/toaster";

const validationSchema = z.object({
  firstName: z.string().max(50).min(1, "Обязательное поле."),
});

type TRegistrationFormValues = z.infer<typeof validationSchema>;

export function RegistrationForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const steps = useSteps({
    defaultStep: 0,
    count: 3,
  });

  const form = useForm({
    defaultValues: {
      phone: "",
      code: "",
      firstName: "",
    },
    onSubmit: ({ value }) => {
      toaster.create({
        title: "Успешная регистрация",
        description: (
          <>
            Добро пожаловать в CineCinema, <strong>{value.firstName}</strong>
          </>
        ),
        type: "success",
      });
      navigate("/profile/");
    },
  });

  const handleError = (error: string) => {
    setError(error);
  };

  useEffect(() => {
    setError("");
  }, [steps.value]);

  return (
    <AuthFormContainer
      onBack={!!steps.hasPrevStep ? () => steps.goToPrevStep() : undefined}
    >
      {steps.value === 0 && (
        <form.Field name="phone">
          {({ handleChange }) => (
            <RegistrationPhoneStage
              error={error}
              onSubmit={(phone) => {
                sendRegistrationCodeFx({ phone })
                  .then(() => {
                    handleChange(phone);
                    steps.goToNextStep();
                  })
                  .catch(({ response }) => setError(response.data.detail));
              }}
              onError={handleError}
            />
          )}
        </form.Field>
      )}

      {steps.value === 1 && (
        <form.Field name="firstName">
          {({ handleChange }) => (
            <UserDataStage
              error={error}
              onSubmit={(value) => {
                handleChange(value);
                steps.goToNextStep();
              }}
              onError={handleError}
            />
          )}
        </form.Field>
      )}

      {steps.value === 2 && (
        <form.Field name="code">
          {({ handleChange }) => (
            <CodeInputStage
              error={error}
              onSubmit={(code) => {
                const phone = form.getFieldValue("phone");
                const firstName = form.getFieldValue("firstName");
                registerSmsFx({
                  phone,
                  firstName,
                  code,
                }).then(() => {
                  handleChange(code);
                  form.handleSubmit();
                });
              }}
              onError={handleError}
            />
          )}
        </form.Field>
      )}
    </AuthFormContainer>
  );
}

export function UserDataStage({ onSubmit }: FormStageProps<string>) {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      firstName: "",
    } as TRegistrationFormValues,
    onSubmit({ value }) {
      onSubmit?.(value.firstName);
    },
  });

  return (
    <Stack gap={5} alignItems="center">
      <IoPersonCircleOutline size={100} color="#0891b2" />
      <Heading>Как Вас можно называть?</Heading>

      <form.Field
        name="firstName"
        validators={{
          onBlur: validationSchema.shape.firstName,
        }}
      >
        {({ state, handleChange, handleBlur }) => (
          <Field.Root invalid={!state.meta.isValid} required>
            <Input
              placeholder="Иван"
              value={state.value}
              onBlur={handleBlur}
              onChange={({ target }) => handleChange(target?.value)}
              size="xl"
              borderRadius="md"
            />
            <Field.ErrorText>{state.meta.errors[0]?.message}</Field.ErrorText>
          </Field.Root>
        )}
      </form.Field>

      <Flex direction="column" gap={2} width="100%">
        <Button variant="subtle" onClick={() => form.handleSubmit()}>
          <IoCreateOutline /> Подтвердить
        </Button>
      </Flex>
      <Text textStyle="xs" textAlign="center" color="gray.500">
        Нажимая на кнопку "Подтвердить" Вы соглашаетесь с{" "}
        <Link variant="underline" color="gray.500">
          пользовательским соглашением
        </Link>
        .
      </Text>
    </Stack>
  );
}
