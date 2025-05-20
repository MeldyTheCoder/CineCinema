import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  GridItem,
  Image,
  Heading,
  Text,
  Separator,
  Flex,
  chakra,
  Blockquote,
  BlockquoteContent,
  Tabs,
  DataList,
  Link,
  Stack,
  Card,
  Bleed,
  Skeleton,
  Spinner,
  Button,
  Center,
  Badge,
  Box,
  Group,
  RatingGroup,
} from "@chakra-ui/react";
import { Header } from "../components/header";
import { Schedule, ScheduleEmptyState } from "../components/films/schedule";
import {
  loadFilmEv,
  $film,
  $filmsLoading,
  loadFilmFx,
  $filmAttachments,
  $filmAttachmentsLoading,
} from "../effector/films.store";
import {
  $schedule,
  $scheduleLoading,
  loadScheduleEv,
} from "../effector/schedule.store.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useStoreMap, useUnit } from "effector-react";
import { formatDuration, dayjs } from "../utils/dates.ts";
import {
  ActorsList,
  ActorsListEmptyState,
} from "../components/films/actors-list.tsx";
import { GenresTags } from "../components/films/genres-tags.tsx";
import { $filmActors, $actorsLoading } from "../effector/actors.store.ts";
import { $selectedRegion } from "../effector/regions.store.ts";
import { $offices, $officesLoading } from "../effector/offices.store.ts";
import { OfficeSelect } from "../components/office-select.tsx";
import { TFilm, TFilmAttachment, TOffice, TSchedule, TSeat } from "../types";
import { FaBuilding } from "react-icons/fa";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { z, infer } from "zod";
import { StageBlockForm } from "../components/stages-block.tsx";
import { MdEventSeat } from "react-icons/md";
import { CinemaScreen } from "../components/cinema-screen.tsx";
import { SeatsGrid } from "../components/seats-grid.tsx";
import { BsStar } from "react-icons/bs";
import { AgeVerificationModal } from "../components/films/age-verification-modal.tsx";
import Slider from "react-slick";
import { styled } from "styled-components";
import Masonry from "react-masonry-css";
import { AttachmentsList } from "../components/films/attachments-list.tsx";

const Divider = chakra(Separator, {
  base: {
    marginY: "1rem",
  },
});

type FilmOrderProps = {
  readonly film: TFilm;
  readonly onRecord?: (film: TFilm, schedule: TSchedule) => void;
};

type StageFormProps = Partial<{
  office: TOffice;
  schedule: TSchedule;
  seat: any;
}>;

const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  arrows: false,
  centerMode: true,
};

function FilmOrder({ film, onRecord }: FilmOrderProps) {
  const [offices, schedule, officesLoading, scheduleLoading] = useUnit([
    $offices,
    $schedule,
    $officesLoading,
    $scheduleLoading,
  ]);

  const getLabelForOffice = (active: boolean, value: TOffice) =>
    active ? (
      <Heading>
        Выберите <Link variant="underline">филиал</Link>
      </Heading>
    ) : value ? (
      <Card.Root padding="5px">
        {value?.region.title}, {value?.address}
      </Card.Root>
    ) : (
      <Text fontWeight="bold">Филиал</Text>
    );

  const getLabelForSchedule = (active: boolean, value: TSchedule) =>
    active ? (
      <Heading>
        Выберите <Link variant="underline">время</Link>
      </Heading>
    ) : value ? (
      <Card.Root>{value.time}</Card.Root>
    ) : (
      <Text fontWeight="bold">Время</Text>
    );

  const handleFormValueChange = ({ office }: StageFormProps) => {
    if (!film) {
      return;
    }

    if (!!office) {
      loadScheduleEv({ officeId: office.id, filmId: film.id });
    }
  };

  const getLabelForSeat = (active: boolean, value: TSeat) =>
    active ? (
      <Heading>
        Выберите <Link variant="underline">место</Link>
      </Heading>
    ) : value ? (
      <Card.Root padding="5px">
        {value.row} ряд {value.column} место
      </Card.Root>
    ) : (
      <Text fontWeight="bold">Место</Text>
    );

  return (
    <Stack gap={10} direction="column">
      <StageBlockForm.Root<StageFormProps>
        defaultValues={{ office: offices[0], schedule: undefined, seat: null }}
        onChange={handleFormValueChange}
      >
        <StageBlockForm.Block
          name="office"
          icon={<FaBuilding />}
          label={getLabelForOffice}
          validator={z.any()}
        >
          {({ handleNext, handleChange, value }) => (
            <>
              {officesLoading ? (
                <Spinner size="lg" />
              ) : (
                <Stack gap={5}>
                  <OfficeSelect
                    value={value!}
                    onSelect={(office) => handleChange(office)}
                  />
                  <Button onClick={handleNext} disabled={!value}>
                    Далее
                  </Button>
                </Stack>
              )}
            </>
          )}
        </StageBlockForm.Block>

        <StageBlockForm.Block
          name="schedule"
          validator={z.any()}
          icon={<RiCalendarScheduleLine />}
          label={getLabelForSchedule}
        >
          {({ handleNext, handleChange }) => (
            <>
              {scheduleLoading ? (
                <Spinner size="lg" />
              ) : !schedule.length ? (
                <ScheduleEmptyState />
              ) : (
                <Stack gap={5}>
                  <Schedule
                    onTimeSelect={(schedule) => {
                      handleChange(schedule);
                      handleNext();
                    }}
                  />
                  <Button onClick={handleNext}>Далее</Button>
                </Stack>
              )}
            </>
          )}
        </StageBlockForm.Block>

        <StageBlockForm.Block
          name="seat"
          validator={z.any()}
          icon={<MdEventSeat />}
          label={getLabelForSeat}
        >
          {({ handleNext, handleChange }) => (
            <Stack gap={5}>
              <Box
                borderWidth={1}
                borderStyle="solid"
                borderColor="gray.800"
                padding="20px"
                borderRadius="15px"
                bg="gray.900"
              >
                <Stack gap={5}>
                  <CinemaScreen />
                  <SeatsGrid hallId={1} />
                </Stack>
              </Box>

              <Button onClick={handleNext}>Далее</Button>
            </Stack>
          )}
        </StageBlockForm.Block>
      </StageBlockForm.Root>
    </Stack>
  );
}

export function Film() {
  const navigate = useNavigate();
  const { filmId } = useParams();
  const [
    film,
    actors,
    loadFilm,
    filmLoading,
    actorsLoading,
    attachments,
    attachmentsLoading,
  ] = useUnit([
    $film,
    $filmActors,
    loadFilmEv,
    $filmsLoading,
    $actorsLoading,
    $filmAttachments,
    $filmAttachmentsLoading,
  ]);

  const handleOrderFilm = () => {
    if (!film) {
      return;
    }
    navigate(`/order/?filmId=${film.id}`)
  }

  useEffect(() => {
    loadFilm({ filmId: +filmId! });
  }, [filmId]);


  return (
    <>
      <Header />
      <Container marginTop="2rem">
        <Grid templateColumns="repeat(3, 1fr)" gapY={{ base: 5, lg: 0 }}>
          <GridItem
            colSpan={{ lg: 1, sm: 3 }}
            rowSpan={3}
            justifyContent={{ base: "center" }}
            alignItems="center"
          >
            <Skeleton loading={filmLoading} width={400} aspectRatio="portrait">
              <Image src={film?.coverUrl} width={400} />
            </Skeleton>
          </GridItem>

          <GridItem colSpan={{ lg: 2, base: 3 }} rowSpan={2}>
            <Flex direction="column" gap={5}>
              <Flex direction="column" gap={2}>
                <Skeleton loading={filmLoading} asChild minHeight={11}>
                  <Heading size="4xl">{film?.title}</Heading>
                </Skeleton>

                <Skeleton
                  loading={filmLoading}
                  minHeight={5}
                  minWidth={70}
                  colorPalette="green"
                >
                  <Group>
                    <GenresTags genres={film?.genres || []} />
                    <Badge
                      background="gray.800"
                      colorPalette="gray"
                      borderRadius="lg"
                    >
                      {film?.ageRestriction}+
                    </Badge>
                  </Group>
                </Skeleton>
              </Flex>
            </Flex>

            <Divider />

            <Flex direction="column" gap={"2rem"}>
              <DataList.Root flexDirection="row" flexWrap="wrap" gapX={10}>
                <DataList.Item key="1">
                  <DataList.ItemLabel>Продолжительность</DataList.ItemLabel>
                  <DataList.ItemValue>
                    <Skeleton loading={filmLoading} minWidth={150}>
                      {formatDuration(film?.durationSeconds || 0)}
                    </Skeleton>
                  </DataList.ItemValue>
                </DataList.Item>

                <DataList.Item key="2">
                  <DataList.ItemLabel>Рейтинг IMDb</DataList.ItemLabel>
                  <DataList.ItemValue>
                    <Skeleton loading={filmLoading} minWidth={50}>
                      {film?.rating}
                    </Skeleton>
                  </DataList.ItemValue>
                </DataList.Item>

                <DataList.Item key="3">
                  <DataList.ItemLabel>Режисер</DataList.ItemLabel>
                  <DataList.ItemValue>
                    <Skeleton loading={filmLoading} minWidth={50}>
                      Виталий Наливкин
                    </Skeleton>
                  </DataList.ItemValue>
                </DataList.Item>

                <DataList.Item key="4">
                  <DataList.ItemLabel>Дата проката</DataList.ItemLabel>
                  <DataList.ItemValue>
                    <Skeleton loading={filmLoading} minWidth={48}>
                      с {dayjs(film?.activeDateFrom).format("DD MMMM")} по{" "}
                      {dayjs(film?.activeDateTo).format("DD MMMM")}
                    </Skeleton>
                  </DataList.ItemValue>
                </DataList.Item>

                <DataList.Item key="5">
                  <DataList.ItemLabel>Актеры</DataList.ItemLabel>
                  <DataList.ItemValue>
                    <Skeleton loading={actorsLoading} minWidth={120}>
                      {actors?.length > 0
                        ? actors
                            .map(
                              (filmActor) =>
                                `${filmActor.actor.firstName} ${filmActor.actor.lastName}`
                            )
                            .join(", ")
                        : "-"}
                    </Skeleton>
                  </DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>

              <Group>
                <Button
                  variant="subtle"
                  colorPalette="purple"
                  size="lg"
                  borderRadius="15px"
                  loading={filmLoading}
                  onClick={handleOrderFilm}
                >
                  Смотреть!
                </Button>
                <Button variant="subtle" borderRadius="15px" loading={filmLoading}>
                  <BsStar />
                </Button>
              </Group>

              <Tabs.Root defaultValue="0" size="lg">
                <Tabs.List>
                  <Tabs.Trigger value="0">Описание</Tabs.Trigger>
                  <Tabs.Trigger value="1">Галерея</Tabs.Trigger>
                  <Tabs.Trigger value="2">Актеры</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="0">
                  <Stack direction="column" gap={10}>
                    {filmLoading ? (
                      <Stack direction="column" gap={2}>
                        {Array(5)
                          .fill(0)
                          .map(() => (
                            <Skeleton loading minHeight={5} />
                          ))}
                      </Stack>
                    ) : (
                      <Text>{film?.description}</Text>
                    )}
                    <Stack direction="row" gap={10} alignItems="center">
                      <Stack direction="column" gap={2}>
                        <Text textStyle="2xl" fontWeight="bold">
                          Рейтинг фильма
                        </Text>
                        <Skeleton loading={filmLoading}>
                          <RatingGroup.Root
                            count={10}
                            value={Math.floor(film?.rating!)}
                            size="lg"
                            disabled
                            colorPalette="purple"
                          >
                            <RatingGroup.HiddenInput />
                            <RatingGroup.Control />
                          </RatingGroup.Root>
                        </Skeleton>
                      </Stack>

                      <Text color="green" fontSize="30px">
                        <Skeleton minHeight={10} loading={filmLoading}>
                          {film?.rating}
                        </Skeleton>
                      </Text>
                    </Stack>
                  </Stack>
                </Tabs.Content>
                <Tabs.Content value="1">
                  <AttachmentsList attachments={attachments!} />
                </Tabs.Content>
                <Tabs.Content value="2">
                  {actorsLoading ? (
                    <Center>
                      <Spinner size="lg" />
                    </Center>
                  ) : !actors.length ? (
                    <ActorsListEmptyState />
                  ) : (
                    <ActorsList filmActors={actors} />
                  )}
                </Tabs.Content>
              </Tabs.Root>
            </Flex>
          </GridItem>
        </Grid>
      </Container>
      {!!film && <AgeVerificationModal film={film!} />}
    </>
  );
}
