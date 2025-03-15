import React, { useEffect, useMemo } from "react";
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
  Badge,
  Stack,
  Skeleton,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { Header } from "../components/header";
import { Schedule, ScheduleEmptyState } from "../components/schedule";
import { loadFilmEv, $film, $filmsLoading } from "../effector/films.store";
import { $schedule } from "../effector/schedule.store.ts";
import { useParams } from "react-router-dom";
import { useUnit } from "effector-react";
import { stringToColor } from "../utils/arrays.ts";
import { formatDuration, dayjs } from "../utils/dates.ts";
import {
  ActorsList,
  ActorsListEmptyState,
} from "../components/ actors-list.tsx";
import { GenresTags } from "../components/genres-tags.tsx";
import { $filmActors, $actorsLoading } from "../effector/actors.store.ts";

const Divider = chakra(Separator, {
  base: {
    marginY: "1rem",
  },
});

export function Film() {
  const { filmId } = useParams();
  const [film, schedule, actors, loadFilm, filmLoading, actorsLoading] =
    useUnit([
      $film,
      $schedule,
      $filmActors,
      loadFilmEv,
      $filmsLoading,
      $actorsLoading,
    ]);

  useEffect(() => {
    loadFilm({ filmId: +filmId! });
  }, [filmId]);

  return (
    <>
      <Header />
      <Container>
        <Grid templateColumns="repeat(3, 1fr)" gapY={{ base: 5, lg: 0 }}>
          <GridItem
            colSpan={{ lg: 1, sm: 3 }}
            rowSpan={3}
            justifyContent={{ base: "center" }}
            alignItems="center"
          >
            <Skeleton loading={filmLoading} width={400} aspectRatio="portrait">
              <Image src={film?.cover_url} width={400} />
            </Skeleton>
          </GridItem>

          <GridItem colSpan={{ lg: 2, base: 3 }} rowSpan={2}>
            <Flex direction="column" gap={5}>
              <Flex direction="column" gap={2}>
                <Skeleton loading={filmLoading} asChild minHeight={11}>
                  <Heading size="4xl">{film?.title}</Heading>
                </Skeleton>

                <Skeleton loading={filmLoading} minHeight={5} minWidth={70} colorPalette="green">
                  <GenresTags genres={film?.genres || []} />
                </Skeleton>
              </Flex>

              <Skeleton loading={filmLoading} asChild minHeight={7}>
                <Blockquote.Root>
                  <BlockquoteContent>
                    <Text>{film?.description}</Text>
                  </BlockquoteContent>
                </Blockquote.Root>
              </Skeleton>
            </Flex>

            <Divider />

            <Flex direction="column" gap={"2rem"}>
              <DataList.Root flexDirection="row" flexWrap="wrap" gapX={10}>
                <DataList.Item key="1">
                  <DataList.ItemLabel>Продолжительность</DataList.ItemLabel>
                  <DataList.ItemValue>
                    <Skeleton loading={filmLoading} minWidth={150}>
                      {formatDuration(film?.duration_seconds || 0)}
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
                      с {dayjs(film?.active_date_from).format("DD MMMM")} по{" "}
                      {dayjs(film?.active_date_to).format("DD MMMM")}
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
                                `${filmActor.actor.first_name} ${filmActor.actor.last_name}`
                            )
                            .join(", ")
                        : "-"}
                    </Skeleton>
                  </DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>

              <Tabs.Root defaultValue="0" size="lg">
                <Tabs.List>
                  <Tabs.Trigger value="0">Ближайшие сеансы</Tabs.Trigger>
                  <Tabs.Trigger value="1">Актеры</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="0">
                  {!schedule.length ? (
                    <ScheduleEmptyState />
                  ) : (
                    <Schedule scheduleList={schedule} />
                  )}
                </Tabs.Content>
                <Tabs.Content value="1">
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
    </>
  );
}
