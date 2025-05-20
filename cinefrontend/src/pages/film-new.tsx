import React, { useEffect, useState } from "react";
import { Header } from "../components/header";
import { $film, loadFilmEv, $filmsLoading } from "../effector/films.store";
import { $actorsLoading, $filmActors } from "../effector/actors.store";
import {
  $filmAttachments,
  $filmAttachmentsLoading,
} from "../effector/films.store";
import { useNavigate, useParams } from "react-router-dom";
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
  HStack,
  DataList,
  Tabs,
  Stack,
  RatingGroup,
  Text,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { TFilmAttachment, TSchedule } from "../types";
import { GenresTags } from "../components/films/genres-tags";
import { dayjs, formatDuration } from "../utils/dates";
import {ActorsListEmptyState, ActorsList} from '../components/films/actors-list';
import { ScheduleNew } from "../components/films/schedule-new";
import { loadScheduleEv } from "../effector/schedule.store";
import { $selectedRegion } from "../effector/regions.store";
import { AgeVerificationModal } from "../components/films/age-verification-modal";
import { AttachmentsList } from "../components/films/attachments-list";
import { SeatSelectModal } from "../components/films/seat-select-modal";

const FilmTrailerContainer = chakra("div", {
  base: {
    position: "relative",
    width: "100%",
    height: "290px",
    bg: "gray.800",
  },
});

const FilmTrailerPlayer = chakra("video", {
  base: {
    position: "absolute",
    width: "inherit",
    height: "390px",
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
      <source src={trailer.attachmentUrl} />
    </FilmTrailerPlayer>
  );
}

export function FilmNew() {
  const navigate = useNavigate();
  const [selectedSchedule, setSelectedSchedule] = useState<TSchedule | null>(null);
  const { filmId } = useParams();
  const [
    region,
    film,
    loadFilm,
    filmLoading,
    actors,
    actorsLoading,
    attachments,
    attachmentsLoading,
  ] = useUnit([
    $selectedRegion,
    $film,
    loadFilmEv,
    $filmsLoading,
    $filmActors,
    $actorsLoading,
    $filmAttachments,
    $filmAttachmentsLoading,
  ]);

  const filmTrailer = useStoreMap<
    TFilmAttachment[],
    TFilmAttachment | undefined
  >($filmAttachments, (attachments) =>
    attachments.find((attachment) => attachment.mimeType === "video")
  );

  const handleScheduleSelect = (schedule: TSchedule) => {
    setSelectedSchedule(schedule);
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
    loadScheduleEv({regionId: region?.id, filmId: +filmId!});
  }, [region, filmId]);

  return (
    <>
      <Header transparent />

      <FilmTrailerContainer>
        {!!filmTrailer && <FilmTrailer trailer={filmTrailer!} />}
      </FilmTrailerContainer>
      <PageBody>
        <Container>
          <Stack gap="3rem">
            <HStack gap={10}>
              <Skeleton
                loading={filmLoading}
                width={250}
                aspectRatio="portrait"
              >
                <Image src={film?.coverUrl} width={250} />
              </Skeleton>
              <Flex direction="column" gap={8}>
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
                        {film?.director || ' - '}
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
              </Flex>
            </HStack>
            
            <ScheduleNew onSelect={handleScheduleSelect} />

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
          </Stack>
        </Container>
      </PageBody>
      
      {!!film && (
         <AgeVerificationModal film={film} />
      )}

      <SeatSelectModal schedule={selectedSchedule} onClose={() => setSelectedSchedule(null)}/>
    </>
  );
}
