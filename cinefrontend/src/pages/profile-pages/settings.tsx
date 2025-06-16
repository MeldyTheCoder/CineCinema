import {
  Button,
  Card,
  Field,
  Grid,
  GridItem,
  HStack,
  Input,
  Separator,
} from "@chakra-ui/react";
import { useUnit } from "effector-react";
import { $user, editProfileFx } from "../../effector/users.store";
import { useForm } from "@tanstack/react-form";
import { useMemo } from "react";
import { z } from "zod";
import { toaster } from "../../components/ui/toaster";
import { UserHeaderCard } from "../../components/profile/user-header-card";
import { withMask } from "use-mask-input";

const profileFormObject = z.object({
  firstName: z
    .string()
    .min(1, "Это обязательное поле.")
    .max(15, "Максимальная длина - 15 символов."),
  lastName: z.union([
    z
      .string()
      .min(1, "Минимальная длина - 1 символ.")
      .max(15, "Максимальная длина - 15 символов."),
    z.string().length(0),
  ]),
  email: z.union([
    z.string().email("Некорректная электронная почта."),
    z.string().length(0),
  ]),
});

export function ProfileSettings() {
  const [user] = useUnit([$user]);

  const formDefaultValues = useMemo(
    () => ({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    }),
    [user]
  );

  const form = useForm({
    defaultValues: formDefaultValues,
    onSubmit: ({ value }) =>
      editProfileFx(value)
        .then(() =>
          toaster.create({
            title: "Профиль успешно обновлен!",
            type: "success",
          })
        )
        .catch(() =>
          toaster.create({
            title:
              "Не удалось обноваить данные профиля. Повторите попытку позднее",
            type: "error",
          })
        ),
  });

  if (!user) {
    return null;
  }

  return (
    <Card.Root padding="30px">
      <UserHeaderCard user={user} />

      <Separator marginY="2rem" />

      <Grid templateColumns="repeat(4, 1fr)" gapX={10} gapY={5}>
        <GridItem colSpan={{ lg: 2, base: 4 }}>
          <form.Field
            name="firstName"
            validators={{
              onBlur: profileFormObject.shape.firstName,
            }}
          >
            {({ state, handleChange, handleBlur }) => (
              <Field.Root invalid={state.meta.errors.length > 0}>
                <Field.RequiredIndicator />
                <Field.Label>Имя</Field.Label>
                <Input
                  placeholder="Введите Ваше имя"
                  value={state.value}
                  onChange={({ target }) => handleChange(target?.value)}
                  onBlur={handleBlur}
                />
                <Field.ErrorText>
                  {state.meta.errors[0]?.message}
                </Field.ErrorText>
              </Field.Root>
            )}
          </form.Field>
        </GridItem>

        <GridItem colSpan={{ lg: 2, base: 4 }}>
          <form.Field
            name="lastName"
            validators={{
              onBlur: profileFormObject.shape.lastName,
            }}
          >
            {({ state, handleChange, handleBlur }) => (
              <Field.Root invalid={state.meta.errors.length > 0}>
                <Field.Label>Фамилия</Field.Label>
                <Input
                  placeholder="Введите Вашу фамилию"
                  value={state.value}
                  onChange={({ target }) => handleChange(target?.value)}
                  onBlur={handleBlur}
                />
                <Field.ErrorText>
                  {state.meta.errors[0]?.message}
                </Field.ErrorText>
              </Field.Root>
            )}
          </form.Field>
        </GridItem>

        <GridItem colSpan={{ lg: 2, base: 4 }}>
          <form.Field
            name="email"
            validators={{
              onBlur: profileFormObject.shape.email,
            }}
          >
            {({ state, handleChange, handleBlur }) => (
              <Field.Root invalid={state.meta.errors.length > 0}>
                <Field.Label>Эл.почта</Field.Label>
                <Input
                  placeholder="Введите Ваш e-mail"
                  value={state.value}
                  onChange={({ target }) => handleChange(target?.value)}
                  onBlur={handleBlur}
                />
                <Field.HelperText>
                  Укажите Вашу почту для отправки рассылок
                </Field.HelperText>
                <Field.ErrorText>
                  {state.meta.errors[0]?.message}
                </Field.ErrorText>
              </Field.Root>
            )}
          </form.Field>
        </GridItem>

        <GridItem colSpan={{ lg: 2, base: 4 }}>
          <Field.Root disabled>
            <Field.Label>Номер телефона</Field.Label>
            <Input
              placeholder="Введите Ваш номер телефона"
              value={user.phone}
              ref={withMask("+9 (999) 999-99-99")}
            />
            <Field.HelperText>
              Номер телефона изменить в данный момент невозможно.
            </Field.HelperText>
          </Field.Root>
        </GridItem>

        <GridItem colSpan={{ lg: 2, base: 4 }}>
          <HStack>
            <Button onClick={() => form.handleSubmit()}>Сохранить</Button>
            {/* <Button variant="ghost" colorPalette="red">
              <AiOutlineUserDelete />
              Удалить аккаунт
            </Button> */}
          </HStack>
        </GridItem>
      </Grid>
    </Card.Root>
  );
}
