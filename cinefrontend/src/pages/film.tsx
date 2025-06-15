import { useEffect, useState } from "react";
import { Header } from "../components/header";
import {
  $film,
  loadFilmEv,
  $filmsLoading,
  $filmAttachments,
  $filmAttachmentsLoading,
  resetFilmAttachmentsEv,
  resetFilmEv,
} from "../effector/films.store";
import { $actorsLoading, $filmActors } from "../effector/actors.store";
import { $schedule, loadScheduleEv } from "../effector/schedule.store";
import { $selectedRegion } from "../effector/regions.store";
import { $tokenData } from "../effector/users.store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStoreMap, useUnit } from "effector-react";
import {
  chakra,
  Container,
  Skeleton,
  Image,
  Flex,
  Group,
  Badge,
  Heading,
  DataList,
  Tabs,
  Stack,
  RatingGroup,
  Text,
  Center,
  Spinner,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { TFilmAttachment, TSchedule } from "../types";
import { dayjs, formatDuration } from "../utils/dates";
import {
  ActorsListEmptyState,
  ActorsList,
  AttachmentsList,
  AgeVerificationModal,
  AgeRestrictionBadge,
  GenresTags,
  Schedule
} from "../components/films/";
import { MakeOrderModal } from "../components/order-modal";
import { parseUrl } from "../utils/urls";

const FilmTrailerContainer = chakra("div", {
  base: {
    position: "relative",
    width: "100%",
    height: { lg: "290px", base: "150px" },
    bg: "gray.800",
  },
});

const FilmTrailerPlayer = chakra("video", {
  base: {
    position: "absolute",
    width: "inherit",
    height: { lg: "390px", base: "270px" },
    objectFit: "cover",
    filter: "blur(5px)" /* Уровень размытия */,
    transform: "scale(1.01)" /* Компенсация краевого эффекта */,
  },
});

const PageBody = chakra("div", {
  base: {
    bg: "transparent",
  },
});

type FilmTrailerProps = {
  readonly trailer: TFilmAttachment;
};

function FilmTrailer({ trailer }: FilmTrailerProps) {
  return (
    <FilmTrailerPlayer autoPlay muted loop>
      <source src={parseUrl(trailer.attachmentUrl)} />
    </FilmTrailerPlayer>
  );
}

export function Film() {
  const navigate = useNavigate();
  const [selectedSchedule, setSelectedSchedule] = useState<TSchedule | null>(
    null
  );
  const { filmId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const scheduleId: number | null = searchParams.get("scheduleId")
    ? +searchParams.get("scheduleId")!
    : null;

  const [
    schedule,
    region,
    film,
    loadFilm,
    filmLoading,
    actors,
    actorsLoading,
    attachments,
    attachmentsLoading,
    resetAttachments,
    resetFilm,
  ] = useUnit([
    $schedule,
    $selectedRegion,
    $film,
    loadFilmEv,
    $filmsLoading,
    $filmActors,
    $actorsLoading,
    $filmAttachments,
    $filmAttachmentsLoading,
    resetFilmAttachmentsEv,
    resetFilmEv,
  ]);

  const isAuthorized = useStoreMap(
    $tokenData,
    (tokenData) => !!tokenData.accessToken
  );

  const filmTrailer = useStoreMap<
    TFilmAttachment[],
    TFilmAttachment | undefined
  >($filmAttachments, (attachments) =>
    attachments.find((attachment) => attachment.mimeType === "video")
  );

  const handleScheduleSelect = (schedule: TSchedule) => {
    if (!isAuthorized) {
      return navigate(
        `/login/?next=${encodeURIComponent(
          window.location.pathname +
            `?scheduleId=${schedule.id}` +
            window.location.hash
        )}`
      );
    }
    setSelectedSchedule(schedule);
  };

  const handleCloseOrderDialog = () => {
    setSelectedSchedule(null);
    setSearchParams("scheduleId", undefined);
  };

  useEffect(() => {
    if (!filmId) {
      navigate("/");
      return;
    }

    if (!region) {
      return;
    }

    loadFilm({ filmId: +filmId });
    loadScheduleEv({ regionId: region?.id, filmId: +filmId! });
  }, [region, filmId]);

  useEffect(() => {
    if (!scheduleId || !schedule) {
      return;
    }

    const selectedScheduleByQuery = schedule.find(
      (schedule_) => schedule_.id === scheduleId
    );

    if (!selectedScheduleByQuery) {
      return;
    }

    setSelectedSchedule(selectedScheduleByQuery);
  }, [scheduleId, schedule]);

  useEffect(() => {
    return () => {
      resetAttachments();
      resetFilm();
    };
  }, []);

  return (
    <>
      <Header transparent />

      <FilmTrailerContainer>
        {!!filmTrailer && <FilmTrailer trailer={filmTrailer!} />}
      </FilmTrailerContainer>
      <PageBody>
        <Container>
          <Stack gap="3rem">
            <Grid templateColumns="repeat(4, 1fr)" gapX={5} gapY={0}>
              <GridItem colSpan={{ lg: 1, base: 4 }} width="fit-content">
                <Skeleton
                  loading={filmLoading}
                  width={{ lg: 250, base: "65%" }}
                  height={{ lg: 383, base: "auto" }}
                  aspectRatio="portrait"
                  borderRadius="10px"
                  justifySelf={{ base: "center", lg: "start" }}
                >
                  <Image
                    src={parseUrl(film?.coverUrl!)}
                    width="100%"
                    height="auto"
                    borderRadius="10px"
                    boxShadow="lg"
                  />
                </Skeleton>
              </GridItem>

              <GridItem
                colSpan={{ lg: 3, base: 4 }}
                marginTop={{ lg: "7rem", base: "2rem" }}
              >
                <Flex direction="column" gap={8}>
                  <Flex direction="column" gap={2}>
                    <Skeleton
                      loading={filmLoading}
                      asChild
                      minHeight={11}
                      alignSelf={{ base: "center", lg: "start" }}
                    >
                      <Heading size="4xl">{film?.title}</Heading>
                    </Skeleton>

                    <Skeleton
                      loading={filmLoading}
                      minHeight={5}
                      minWidth={70}
                      alignSelf={{ base: "center", lg: "start" }}
                    >
                      <Group>
                        <GenresTags genres={film?.genres || []} />
                        <AgeRestrictionBadge
                          ageRestriction={film?.ageRestriction!}
                        />
                      </Group>
                    </Skeleton>
                  </Flex>

                  <DataList.Root
                    flexDirection="row"
                    flexWrap="wrap"
                    gapX={10}
                    size={{ lg: "lg", base: "sm" }}
                    display={{ base: "none", md: "flex" }}
                  >
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
                          {film?.director || " - "}
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
                                .slice(0, 2)
                                .map(
                                  (filmActor) =>
                                    `${filmActor.actor.firstName} ${filmActor.actor.lastName}`
                                )
                                .join(", ")
                            : "-"}
                          {actors?.length > 2 && (
                            <Badge marginLeft="5px">+{actors.length - 2}</Badge>
                          )}
                        </Skeleton>
                      </DataList.ItemValue>
                    </DataList.Item>
                  </DataList.Root>
                </Flex>
              </GridItem>
            </Grid>

            <Schedule onSelect={handleScheduleSelect} />

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
                    <Text fontSize={{ base: "14px", lg: "16px" }}>
                      {film?.description}
                    </Text>
                  )}

                  <DataList.Root
                    flexDirection="row"
                    flexWrap="wrap"
                    gapX={10}
                    size={{ lg: "lg", base: "md" }}
                    display={{ base: "flex", md: "none" }}
                  >
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
                          {film?.director || " - "}
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
          </Stack>
        </Container>
      </PageBody>

      {!!film && <AgeVerificationModal film={film} />}

      <MakeOrderModal
        schedule={selectedSchedule!}
        onClose={handleCloseOrderDialog}
      />
    </>
  );
}
