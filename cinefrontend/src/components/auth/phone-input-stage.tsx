import { useNavigate } from "react-router-dom";
import { FormStageProps } from "./auth-form-container";
import { withMask } from "use-mask-input";
import { useState } from "react";
import {
  Stack,
  Image,
  Heading,
  Text,
  Field,
  Input,
  Flex,
  Button,
  Link,
  Separator,
} from "@chakra-ui/react";
import ReactSVG from "../../assets/react.svg";
import { IoCreateOutline, IoLogInOutline } from "react-icons/io5";
import { z } from "zod";

export function LoginPhoneStage({
  error,
  onSubmit,
  onError,
}: FormStageProps<string>) {
  const navigate = useNavigate();
  const inputRef = withMask("+7 (999) 999-99-99");
  const [phone, setPhone] = useState<string>("");

  const handleResetErrorAfterTouch = ({ target }: any) => {
    setPhone(target?.value?.replace(/\D/g, ""));

    if (error) {
      onError?.("");
    }
  };

  const handlePhoneValidate = (phone: string) => {
    z.string()
      .length(11, "Некорректный номер телефона.")
      .parseAsync(phone)
      .catch(() => onError?.("Некорректный номер телефона."));
  };

  const handlePhoneSubmit = () => {
    if (!error) onSubmit?.(phone);
  };

  const handleRegister = () => {
    navigate("/registration/");
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
        <Button variant="subtle" onClick={handleRegister}>
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

export function RegistrationPhoneStage({
  error,
  onSubmit,
  onError,
}: FormStageProps<string>) {
  const inputRef = withMask("+7 (999) 999-99-99");
  const [phone, setPhone] = useState<string>("");

  const handleResetErrorAfterTouch = ({ target }: any) => {
    setPhone(target?.value?.replace(/\D/g, ""));

    if (error) {
      onError?.("");
    }
  };

  const handlePhoneValidate = (phone: string) => {
    z.string()
      .length(11, "Некорректный номер телефона.")
      .parseAsync(phone)
      .catch(() => onError?.("Некорректный номер телефона."));
  };

  const handlePhoneSubmit = () => {
    if (!error) onSubmit?.(phone);
  };

  return (
    <Stack gap={5} alignItems="center">
      <Image src={ReactSVG} />
      <Heading>Регистрация аккаунта</Heading>
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
          <IoCreateOutline /> Продолжить
        </Button>
      </Flex>
      <Text textStyle="xs" textAlign="center" color="gray.500">
        Нажимая на кнопку "Продолжить" Вы соглашаетесь с{" "}
        <Link variant="underline" color="gray.500">
          пользовательским соглашением
        </Link>
        .
      </Text>
    </Stack>
  );
}
