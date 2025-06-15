import { useUnit } from "effector-react";
import { TSchedule } from "../../types";
import { filterByUnique, groupByKey } from "../../utils/arrays";
import {
  getByDayId,
  dayjs,
  getTimeFromSeconds,
  getWeekday,
} from "../../utils/dates";
import { $schedule, $scheduleLoading } from "../../effector/schedule.store";
import { useEffect, useMemo, useState } from "react";
import {
  chakra,
  Text,
  Separator,
  Heading,
  Stack,
  Link,
  Image,
  Group,
  Badge,
  Skeleton,
  Box,
  Card,
} from "@chakra-ui/react";
import { TbBuildingPavilion } from "react-icons/tb";
import { Map } from "./map";
import styled from "styled-components";

const DayBoxContainer = chakra("div", {
  base: {
    color: "purple.500",
    transition: "color 0.3s",
    textAlign: "center",
    justifyContent: "center",
    _hover: {
      color: "purple.200",
    },
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
});

const MapWrapper = styled(Card.Root).attrs({
  variant: "elevated",
  boxShadow: 'lg',
})`
  div[dir="ltr"] {
    border-radius: 10px;
  }
  border-radius: 10px;
`;

function groupByDate(schedule: TSchedule[]) {
  return groupByKey(schedule, (scheduleElement) => {
    const date = getByDayId(scheduleElement.dayId, scheduleElement.year);
    const dateString = date.format("DD.MM.YYYY");
    return dateString;
  });
}

function groupByOffice(schedule: TSchedule[]) {
  return groupByKey(
    schedule,
    (scheduleElement) => scheduleElement.hall.office.title
  );
}

function groupByHall(schedule: TSchedule[]) {
  return groupByKey(
    schedule,
    (scheduleElement) => `Зал "${scheduleElement.hall.title}"`
  );
}

type MonthDayButtonsProps = {
  readonly schedule: TSchedule[];
  readonly onClick: (_: dayjs.Dayjs) => void;
  readonly selected?: dayjs.Dayjs;
};

type ScheduleControlsProps = {
  readonly schedule: TSchedule[];
  readonly children: (filteredSchedule: TSchedule[]) => React.ReactNode;
};

type OfficeCardProps = {
  readonly title: string;
  readonly schedule: TSchedule[];
  readonly onScheduleSelect: (_: TSchedule) => void;
};

function MonthDayButtons({
  schedule,
  onClick,
  selected,
}: MonthDayButtonsProps) {
  const isSelected = (date: dayjs.Dayjs) => {
    return date.format("DD.MM.YYYY") == selected?.format("DD.MM.YYYY");
  };

  const filteredSchedule = useMemo(
    () => filterByUnique(schedule, (scheduleElement) => scheduleElement.dayId),
    [schedule]
  );

  return (
    <Stack direction="row" gap="3rem">
      {filteredSchedule.map((scheduleElement) => {
        const dateObject = getByDayId(
          scheduleElement.dayId,
          scheduleElement.year
        );
        return (
          <DayBoxContainer
            onClick={() => onClick?.(dateObject)}
            color={isSelected(dateObject) ? "purple.200" : undefined}
          >
            <Text fontSize="24px">{dateObject.format("DD")}</Text>
            <Text fontSize="12px">{getWeekday(dateObject.weekday())}</Text>
          </DayBoxContainer>
        );
      })}
    </Stack>
  );
}

function MonthWrapper({ month, children }: any) {
  return (
    <Stack gap={2}>
      <Text textStyle="xs">{month.toUpperCase()}</Text>
      {children}
    </Stack>
  );
}

type ScheduleButtonProps = {
  readonly schedule: TSchedule;
  readonly onClick: (_: TSchedule) => void;
};

function ScheduleButton({ schedule, onClick }: ScheduleButtonProps) {
  return (
    <div onClick={() => onClick?.(schedule)}>
      <Stack gap="0px">
        <Link fontSize="24px" colorPalette="purple" lineHeight="24px">
          {getTimeFromSeconds(schedule.time)}
        </Link>
        <Text fontSize="12px">
          {(schedule.film.price * schedule.hall.priceFactor) / 100} ₽
        </Text>
      </Stack>
    </div>
  );
}
function ScheduleControls({ schedule, children }: ScheduleControlsProps) {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>();
  const groupedByMonth = useMemo(
    () =>
      groupByKey(schedule, (scheduleElement) =>
        getByDayId(scheduleElement.dayId, scheduleElement.year).format("MMMM")
      ),
    [schedule]
  );

  const scheduleForDay = useMemo(
    () =>
      schedule.filter((scheduleElement) => {
        const scheduleDate = getByDayId(
          scheduleElement.dayId,
          scheduleElement.year
        );
        return (
          scheduleDate.format("DD.MM.YYYY") ===
          selectedDate?.format("DD.MM.YYYY")
        );
      }),
    [selectedDate, schedule]
  );

  const handleDaySelect = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (!schedule || schedule.length === 0) {
      return;
    }

    const initialDate = getByDayId(schedule[0]?.dayId, schedule[0].year);
    setSelectedDate(initialDate);
  }, [schedule]);

  return (
    <Stack gap={5}>
      {Object.entries(groupedByMonth).map(([month, scheduleList]) => {
        return (
          <MonthWrapper month={month}>
            <MonthDayButtons
              selected={selectedDate!}
              schedule={scheduleList}
              onClick={(date: dayjs.Dayjs) => handleDaySelect(date)}
            />
          </MonthWrapper>
        );
      })}
      {children(scheduleForDay)}
    </Stack>
  );
}

function OfficeCard({ title, schedule, onScheduleSelect }: OfficeCardProps) {
  const groupedByHalls = useMemo(() => groupByHall(schedule), [schedule]);

  return (
    <Stack
      gap={{ base: 10, lg: 5 }}
      direction={{ base: "column", lg: "row" }}
      width="100%"
    >
      <MapWrapper width={{ base: "100%", lg: "300px" }} height="200px">
        <Map
          longitude={35.9242}
          latitude={56.8625}
          key={`map-${title}`}
        />
      </MapWrapper>
      <Stack gapY={3} direction="column">
        <Heading>{title}</Heading>
        <Stack gap={5}>
          {Object.entries(groupedByHalls).map(([hallTitle, schedule]) => (
            <Stack gap={2}>
              <Badge>
                <TbBuildingPavilion />
                <Text fontSize="12px">{hallTitle}</Text>
              </Badge>
              <Stack direction="row" gap="3rem">
                {schedule.map((scheduleElement) => (
                  <ScheduleButton
                    schedule={scheduleElement}
                    onClick={onScheduleSelect!}
                  />
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

type ScheduleNewProps = {
  readonly onSelect: (_: TSchedule) => void;
};

export function ScheduleNew({ onSelect }: ScheduleNewProps) {
  const [schedule, scheduleLoading] = useUnit([$schedule, $scheduleLoading]);

  const handleScheduleSelect = (schedule: TSchedule) => {
    onSelect?.(schedule);
  };

  const renderSkeleton = () => (
    <Stack gap={5}>
      <Stack gap={2}>
        <Skeleton loading width={100} minH={6} />

        <Stack gap={10} direction="row">
          {Array(3)
            .fill(0)
            .map(() => (
              <Skeleton
                loading
                width="45px"
                height="59px"
                colorPalette="purple"
              />
            ))}
        </Stack>
      </Stack>

      <Separator />

      {Array(2)
        .fill(0)
        .map(() => (
          <Stack gap={5} direction="row" width="100%">
            <Skeleton width="300px" height="200px" />
            <Stack gapY={3} direction="column">
              <Skeleton height={7} />
              <Stack gap={7}>
                {Array(2)
                  .fill(0)
                  .map(() => (
                    <Stack gap={2}>
                      <Skeleton height={4} width="100px" />
                      <Stack direction="row" gap="3rem">
                        {Array(3)
                          .fill(0)
                          .map(() => (
                            <Skeleton width="65px" height="40px" />
                          ))}
                      </Stack>
                    </Stack>
                  ))}
              </Stack>
            </Stack>
          </Stack>
        ))}
    </Stack>
  );
  return (
    <Stack gap={5}>
      {scheduleLoading ? (
        renderSkeleton()
      ) : (
        <ScheduleControls schedule={schedule}>
          {(scheduleForDay) => {
            const groupedByOffice = groupByOffice(scheduleForDay);
            return (
              <>
                <Separator />
                <Stack gap={10}>
                  {Object.entries(groupedByOffice).map(
                    ([officeTitle, schedule]) => (
                      <div>
                        <OfficeCard
                          title={officeTitle}
                          schedule={schedule}
                          onScheduleSelect={handleScheduleSelect}
                        />
                      </div>
                    )
                  )}
                </Stack>
              </>
            );
          }}
        </ScheduleControls>
      )}
    </Stack>
  );
}
