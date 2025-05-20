import { useEffect, useMemo } from "react";
import {
  Card,
  Container,
  Separator,
  Image,
  Box,
  Flex,
  HStack,
  Stack,
  Badge,
  VStack,
  DataList,
  Group,
  Heading,
  Link,
  Text,
  ButtonGroup,
  Button,
  Status,
  Steps,
  Skeleton,
  Grid,
  chakra,
  Avatar,
  useSteps,
  Blockquote,
  GridItem,
} from "@chakra-ui/react";
import { Header } from "../components/header";
import { SeatsGrid, SeatBlock, SeatBox } from "../components/seats-grid";
import { useSearchParams } from "react-router-dom";
import { useUnit } from "effector-react";
import {
  $schedule,
  $scheduleElement,
  $scheduleLoading,
  loadScheduleByIdFx,
  loadScheduleEv,
} from "../effector/schedule.store";
import { GenresTags } from "../components/films/genres-tags";
import {
  $seats,
  $seatsLoading,
  loadHallSeatsFx,
} from "../effector/halls.store";
import { CinemaScreen } from "../components/cinema-screen";
import { IoMdReturnLeft } from "react-icons/io";
import { $film, $filmsLoading, loadFilmFx } from "../effector/films.store";
import { loadOfficesFx } from "../effector/offices.store";
import { useForm, useStore } from "@tanstack/react-form";
import { TOffice, TSchedule, TSeat } from "../types";
import { OfficeSelect } from "../components/office-select";
import { Schedule } from "../components/films/schedule";
import { OfficeSchema, ScheduleSchema, SeatSchema } from "../schemas";
import { FaBuilding } from "react-icons/fa";
import { toaster } from "../components/ui/toaster";

const Divider = chakra(Separator, {
  base: {
    marginY: "0.5rem",
    width: "100%",
  },
});

type CreateOrderFormValues = {
  office: TOffice | null;
  schedule: TSchedule | null;
  seat: TSeat | null;
};

const FormBlockTitle = chakra("div", {
  base: {
    bg: "gray.900",
    borderRadius: "15px",
    fontSize: "20px",
    fontWeight: "bold",
    minH: "75px",
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    padding: "10px",
    gap: 2,
  },
});

const IconContainer = chakra("div", {
  base: {
    borderRadius: "100%",
    bg: "gray.700",
    fontSize: "20px",
    borderWidth: "1px",
    borderColor: "gray.500",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px",
    display: "flex",
  },
});

export function CreateOrder() {
  const form = useForm({
    defaultValues: {
      office: null,
      schedule: null,
      seat: null,
    } as CreateOrderFormValues,
    onSubmit: ({ value }) => console.log(value),
  });
  const steps = useSteps({ count: 3 });
  const formStore = useStore(form.store);

  const [params] = useSearchParams();
  const [film, filmLoading, schedule, scheduleLoading, seats, seatsLoading] =
    useUnit([
      $film,
      $filmsLoading,
      $schedule,
      $scheduleLoading,
      $seats,
      $seatsLoading,
    ]);

  useEffect(() => {
    const filmId = +params.get("filmId")!;
    if (!filmId) {
      window.location.href = "/";
      return;
    }

    loadFilmFx({ filmId });
  }, []);

  useEffect(() => {
    if (!film || !formStore.values.office) {
      return;
    }

    form.resetField("seat");
    form.resetField("schedule");

    OfficeSchema.parseAsync(formStore.values.office!)
      .then((office) => {
        loadScheduleEv({ filmId: film?.id, officeId: office.id });
        steps.setStep(1);
      })
      .catch((error) => {
        console.log(error);
        toaster.create({ title: "Неверно выбрал филиал.", type: "error" });
      });
  }, [formStore.values.office]);

  useEffect(() => {
    if (!film || !formStore.values.schedule) {
      return;
    }
    form.resetField("seat");

    ScheduleSchema.parseAsync(formStore.values.schedule!)
      .then((schedule) => {
        loadHallSeatsFx({ hallId: schedule.hall.id });
        steps.setStep(2);
      })
      .catch(() =>
        toaster.create({
          title: "Неверно выбрано время сеанса.",
          type: "error",
        })
      );
  }, [formStore.values.schedule]);

  useEffect(() => {
    if (!film || !formStore.values.seat) {
      return;
    }
    SeatSchema.parseAsync(formStore.values.seat!)
      .then(() => {
        steps.setStep(3);
      })
      .catch(() =>
        toaster.create({
          title: "Неверно выбрано места в зале кинотеатра.",
          type: "error",
        })
      );
  }, [formStore.values.seat]);

  if (filmLoading || !film) {
    return null;
  }

  const formSteps = [
    {
      title: "Филиал",
      description: (
        <Stack gap={2} direction="column">
          <FormBlockTitle>
            <IconContainer>
              <FaBuilding />
            </IconContainer>
            <Heading>
              Выберите <Link variant="underline">филиал</Link>
            </Heading>
          </FormBlockTitle>

          <Divider />

          <form.Field name="office" validators={{ onBlur: OfficeSchema }}>
            {({ state, handleChange, handleBlur }) => (
              <OfficeSelect
                value={state.value!}
                onSelect={(office) => handleChange(office)}
              />
            )}
          </form.Field>
        </Stack>
      ),
    },
    {
      title: "Время",
      description: (
        <Stack gap={2} direction="column">
          <FormBlockTitle>
            <IconContainer>
              <FaBuilding />
            </IconContainer>
            <Heading>
              Выберите <Link variant="underline">время</Link>
            </Heading>
          </FormBlockTitle>

          <Divider />

          <form.Field name="schedule" validators={{ onBlur: ScheduleSchema }}>
            {({ state, handleChange, handleBlur }) => (
              <Schedule onTimeSelect={(schedule) => handleChange(schedule)} />
            )}
          </form.Field>
        </Stack>
      ),
    },
    {
      title: "Место",
      description: (
        <Stack gap={2} direction="column">
          <FormBlockTitle>
            <IconContainer>
              <FaBuilding />
            </IconContainer>
            <Heading>
              Выберите <Link variant="underline">место</Link>
            </Heading>
          </FormBlockTitle>

          <Divider />

          <form.Field name="seat" validators={{ onBlur: SeatSchema }}>
            {({ state, handleChange, handleBlur }) => <div />}
          </form.Field>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Header />

      <Container maxW="70rem">
        <Stack direction="column">
          <Grid templateColumns="repeat(4, 1fr)" gap={10}>
            <GridItem colSpan={1} rowSpan={3}>
              <Skeleton
                loading={filmLoading}
                width={250}
                aspectRatio="portrait"
              >
                <Image src={film?.coverUrl} width={250} borderRadius="15px" />
              </Skeleton>
            </GridItem>

            <GridItem colSpan={2}>
              <Stack gap={3} direction="column">
                <Text textStyle="2xl" fontSize="30px" fontWeight="bold">
                  {film.title}
                </Text>

                <Group>
                  {film.genres?.length > 0 && (
                    <GenresTags genres={film.genres!} />
                  )}
                  <Badge background="gray.800" borderRadius="lg">
                    {film.ageRestriction}+
                  </Badge>
                </Group>
              </Stack>
            </GridItem>

            <GridItem colSpan={3}>
              <Blockquote.Root>
                <Blockquote.Content>{film.description}</Blockquote.Content>
              </Blockquote.Root>
            </GridItem>
          </Grid>

          <Divider />

          <Steps.RootProvider value={steps}>
            <Steps.List>
              {formSteps.map((step, index) => (
                <Steps.Item key={index} index={index} title={step.title}>
                  <Steps.Indicator />
                  <Steps.Title>{step.title}</Steps.Title>
                  <Steps.Separator />
                </Steps.Item>
              ))}
            </Steps.List>

            {formSteps.map((step, index) => (
              <Steps.Content key={index} index={index}>
                {step.description}
              </Steps.Content>
            ))}
          </Steps.RootProvider>
        </Stack>
      </Container>
    </>
  );
}
