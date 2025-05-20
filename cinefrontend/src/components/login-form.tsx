import React, { useEffect, useState, useRef } from "react";
import { sendCodeFx, loginFx } from "../effector/users.store";
import { withMask } from "use-mask-input";
import {
  chakra,
  Card,
  Input,
  Heading,
  PinInput,
  Container,
  Field,
  Stack,
  Separator,
  Flex,
  IconButton,
  Text,
  Button,
  Image,
  Link,
  AbsoluteCenter,
  usePinInput,
  Box,
} from "@chakra-ui/react";
import { MdSms } from "react-icons/md";
import { z } from "zod";
import { useUnit, useStoreMap } from "effector-react";
import { FaArrowLeft } from "react-icons/fa6";
import { createCountdown } from "../effector/timer.store";
import { toaster } from "./ui/toaster";
import ReactSVG from "../assets/react.svg";
import { IoLogInOutline, IoCreateOutline } from "react-icons/io5";

type FormStageProps<T> = {
  readonly onSubmit?: (_: T) => void;
  readonly error?: string;
  readonly onError?: (_: string) => void;
};

const FormContainer = chakra(
  Card.Root,
  {
    base: {
      borderRadius: "10px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      paddingX: "25px",
      paddingY: "20px",
      _open: {
        animation: "fade-in 500ms ease-out",
      },
    },
  },
  {
    defaultProps: { width: "sm", "data-state": "open" },
  }
);

const CodeDescriptionsContainer = chakra(
  Stack,
  {
    base: {
      textAlign: "center",
    },
  },
  { defaultProps: { gap: 1 } }
);

const BackButton = chakra(
  IconButton,
  {
    base: {
      position: "absolute",
      left: 5,
      top: 2,
    },
  },
  {
    defaultProps: { variant: "ghost", children: <FaArrowLeft /> },
  }
);

const formValidators = {
  phone: z.string().length(11, "Некорректный номер телефона."),
  code: z.string().length(6, "Введен некорректный код."),
};

function PhoneInputStage({ error, onSubmit, onError }: FormStageProps<string>) {
  const inputRef = withMask("+7 (999) 999-99-99");
  const [phone, setPhone] = useState<string>("");

  const handleResetErrorAfterTouch = ({ target }) => {
    setPhone(target?.value?.replace(/\D/g, ""));

    if (error) {
      onError?.("");
    }
  };

  const handlePhoneValidate = (phone: string) => {
    formValidators.phone
      .parseAsync(phone)
      .catch(() => onError?.("Некорректный номер телефона."));
  };

  const handlePhoneSubmit = () => {
    if (!error) onSubmit?.(phone);
  };

  return (
    <Stack gap={5} alignItems="center">
      <Image src={ReactSVG} />
      <Heading>Вход в аккаунт</Heading>
      <Field.Root invalid={!!error}>
        <Input
          ref={inputRef}
          placeholder="+7 (___) ___-__-__"
          onBlur={({ target }) =>
            handlePhoneValidate?.(target.value?.replace(/\D/g, ""))
          }
          onChange={handleResetErrorAfterTouch}
          size="xl"
          borderRadius="md"
        />
        <Field.ErrorText>{error}</Field.ErrorText>
      </Field.Root>
      <Flex direction="column" gap={2} width="100%">
        <Button variant="subtle" onClick={handlePhoneSubmit}>
          <IoLogInOutline /> Войти
        </Button>
        <Separator />
        <Button variant="subtle">
          <IoCreateOutline /> Зарегистрироваться
        </Button>
      </Flex>
      <Text textStyle="xs" textAlign="center" color="gray.500">
        Нажимая на кнопку "Войти" Вы соглашаетесь с{" "}
        <Link variant="underline" color="gray.500">
          пользовательским соглашением
        </Link>
        .
      </Text>
    </Stack>
  );
}

function CodeInputStage({ error, onError, onSubmit }: FormStageProps<string>) {
  const { tick, startTimer, resetTimer } = createCountdown("sms", 1000);
  const [time, setTime] = useState<number>(5 * 60);

  const handleResetErrorAfterTouch = () => {
    if (error) {
      onError?.("");
      pinInput.clearValue();
    }
  };

  const pinInput = usePinInput({
    otp: true,
    type: "numeric",
    onValueComplete: ({ valueAsString }) => {
      onSubmit?.(valueAsString);
    },
    onValueChange: handleResetErrorAfterTouch,
    invalid: !!error,
  });

  const handleResendCode = () => {
    sendCodeFx({ phone: "1123343" }).then(() => {
      resetTimer();
      startTimer(5 * 60);
      toaster.create({
        title: "Код успешно отправлен на Ваш номер телефона!",
        type: "success",
      });
    });
  };

  useEffect(() => {
    const resetTickWatcher = tick.watch((data) => setTime(data));
    const resetTimerResetter = resetTimer.watch(() => setTime(0));

    startTimer(5 * 60);

    return () => {
      resetTickWatcher();
      resetTimerResetter();
    };
  }, []);

  return (
    <Stack gap={5} alignItems="center" marginTop={5}>
      <MdSms size={100} color="#0891b2" />

      <CodeDescriptionsContainer>
        <Heading>Введите код из СМС</Heading>
        <Text>Мы отправили Вам код подтверждения на Ваш номер телефона.</Text>
      </CodeDescriptionsContainer>

      <PinInput.RootProvider value={pinInput}>
        <PinInput.Control>
          {Array.from({ length: 6 }).map((_, index) => (
            <PinInput.Input key={index} index={index} />
          ))}
        </PinInput.Control>
      </PinInput.RootProvider>

      <Button variant="ghost" disabled={!!time} onClick={handleResendCode}>
        Отправить код еще раз {!time ? null : `(${time})`}
      </Button>
    </Stack>
  );
}

type LoginFormProps = {
  readonly onPhoneSubmit: (_: string) => void;
  readonly onCodeSubmit: (_: string) => void;
}

export function LoginForm() {
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>("");
  const [codeError, setCodeError] = useState<string>("");

  const [phone, setPhone] = useState<string>("");

  const handlePhoneSubmit = (phone: string) => {
    setPhone(phone);
    sendCodeFx({ phone })
      .then((status) => setCodeSent(status))
      .catch(({ response }) => setPhoneError(response.data.detail));
  };

  const handleCodeSubmit = (code: string) => {
    loginFx({ phone, code })
      .then(() =>
        toaster.create({ title: "Вы успешно вошли!", type: "success" })
      )
      .catch(({ response }) => setCodeError(response.data.detail));
  };

  return (
    <Box position="relative" minH="60vh">
      <AbsoluteCenter axis="both">
        <FormContainer>
          {!!codeSent && (
            <BackButton onClick={() => setCodeSent(false)}>
              <FaArrowLeft />
            </BackButton>
          )}

          {!codeSent ? (
            <PhoneInputStage
              error={phoneError}
              onSubmit={handlePhoneSubmit}
              onError={(error) => setPhoneError(error)}
            />
          ) : (
            <CodeInputStage
              error={codeError}
              onSubmit={handleCodeSubmit}
              onError={(error) => setCodeError(error)}
            />
          )}
        </FormContainer>
      </AbsoluteCenter>
    </Box>
  );
}
