import React, { useEffect, useMemo, useState } from "react";
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
  Skeleton,
  Spinner,
  Button,
  Badge,
  Center,
} from "@chakra-ui/react";
import { Header } from "../components/header";
import { Schedule, ScheduleEmptyState } from "../components/schedule";
import { loadFilmEv, $film, $filmsLoading } from "../effector/films.store";
import {
  $schedule,
  $scheduleLoading,
  loadScheduleEv,
} from "../effector/schedule.store.ts";
import { useParams } from "react-router-dom";
import { useUnit } from "effector-react";
import { formatDuration, dayjs } from "../utils/dates.ts";
import {
  ActorsList,
  ActorsListEmptyState,
} from "../components/ actors-list.tsx";
import { GenresTags } from "../components/genres-tags.tsx";
import { $filmActors, $actorsLoading } from "../effector/actors.store.ts";
import { $selectedRegion } from "../effector/regions.store.ts";
import {
  $offices,
  $officesLoading,
  loadOfficesEv,
  loadOfficesFx,
} from "../effector/offices.store.ts";
import { OfficeSelect } from "../components/office-select.tsx";
import { TFilm, TOffice, TSchedule } from "../types";
import { FaBuilding } from "react-icons/fa";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { StageBlockForm } from "../components/stages-block.tsx";

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
        >
          {({ handleNext, handleChange, value }) => (
            <>
              {officesLoading ? (
                <Spinner size="lg" />
              ) : (
                <Stack gap={5}>
                  <OfficeSelect
                    elements={offices}
                    value={value!}
                    onSelect={(office) => handleChange(office)}
                  />
                  <Button onClick={() => handleNext()} disabled={!value}>
                    Далее
                  </Button>
                </Stack>
              )}
            </>
          )}
        </StageBlockForm.Block>

        <StageBlockForm.Block
          name="schedule"
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
                    scheduleList={schedule}
                    onTimeSelect={(schedule) => handleChange(schedule)}
                  />
                  <Button onClick={handleNext}>Далее</Button>
                </Stack>
              )}
            </>
          )}
        </StageBlockForm.Block>
      </StageBlockForm.Root>
    </Stack>
  );
}
export function Film() {
  const { filmId } = useParams();
  const [film, actors, loadFilm, filmLoading, actorsLoading] = useUnit([
    $film,
    $filmActors,
    loadFilmEv,
    $filmsLoading,
    $actorsLoading,
    $selectedRegion,
    $offices,
  ]);

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
              <Image src={film?.cover_url} width={400} />
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
                  <FilmOrder film={film!} />
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
