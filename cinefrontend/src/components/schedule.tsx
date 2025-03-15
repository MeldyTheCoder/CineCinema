import {
  Stack,
  StackSeparator,
  Text,
  chakra,
  Button,
  Card,
  IconButton,
  EmptyState,
  VStack,
} from "@chakra-ui/react";
import { groupByKey } from "../utils/arrays";
import { useMemo } from "react";
import { TSchedule } from "../types";
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
  PopoverArrow,
} from "./ui/popover";
import { getByDayId, getTimeFromSeconds, getCurrentDate } from "../utils/dates";
import { FaCartArrowDown } from "react-icons/fa6";
import { MdSchedule } from "react-icons/md";

type DayRowProps = {
  readonly dayId: number;
  readonly year: number;
  readonly schedule: TSchedule[];
  readonly onCellSelect?: (schedule: TSchedule) => void;
};

type ScheduleCellPopoverProps = {
  readonly children: React.ReactElement;
  readonly schedule: TSchedule;
  readonly onCreateOrder: (_: TSchedule) => void;
};

const DayRowContainer = chakra("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    justifyContent: "center",
    minWidth: "8rem",
  },
});

const DayTitle = chakra(
  Card.Root,
  {
    base: {
      paddingY: "5px",
      paddingX: "20px",
      textTransform: "capitalize",
      bg: "white.900",
    },
  },
  {
    defaultProps: {
      colorPalette: "cyan.950",
      variant: "outline",
      size: "lg",
      alignItems: "center",
    },
  }
);

const DayRowCells = chakra("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "5px",
    justifyContent: "start",
    maxWidth: { xl: "10rem", base: "100%" },
  },
});

const CellButton = chakra(
  Button,
  {
    base: {
      padding: 0,
      margin: 0,
      lineHeight: "16px",
      borderRadius: "15px",
    },
  },
  { defaultProps: { variant: "subtle", size: "xl" } }
);

const PopoverBodyRelative = chakra(PopoverBody, {
  base: {
    position: "relative",
  },
});

const BuyTicketButton = chakra(
  IconButton,
  {
    base: {
      position: "absolute",
      left: "83%",
      top: "24%",
    },
  },
  { defaultProps: { variant: "surface" } }
);

export function ScheduleEmptyState() {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <MdSchedule />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>Ближайшие сеансы не найдены.</EmptyState.Title>
          <EmptyState.Description>
            К сожалению, в данный момент ближайшие сеансы отсутсвуют.
          </EmptyState.Description>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
export function ScheduleCellPopover({
  schedule,
  children,
}: ScheduleCellPopoverProps) {
  return (
    <PopoverRoot size="xs" modal>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBodyRelative>
          <Text textStyle="lg" fontWeight="bold">
            {schedule.film.price * schedule.hall.price_factor} RUB
          </Text>
          <Text>Зал: {schedule.hall.title}</Text>
          <BuyTicketButton>
            <FaCartArrowDown />
          </BuyTicketButton>
        </PopoverBodyRelative>
      </PopoverContent>
    </PopoverRoot>
  );
}

export function DayRow({ dayId, year, schedule, onCellSelect }: DayRowProps) {
  const currentDate = getCurrentDate();
  const scheduleDayDate = useMemo(() => getByDayId(dayId, year), [dayId, year]);

  const handleCellSelect = (schedule: TSchedule) => {
    onCellSelect?.(schedule);
  };

  return (
    <DayRowContainer>
      <DayTitle>
        <Text fontWeight="bold">{scheduleDayDate.format("dddd")}</Text>
        <Text>
          {scheduleDayDate.isSame(currentDate, "day")
            ? "сегодня"
            : scheduleDayDate.format(
                year !== currentDate.year() ? "D MMMM YYYY" : "D MMMM"
              )}
        </Text>
      </DayTitle>

      <DayRowCells>
        {schedule.map((_schedule) => (
          <ScheduleCellPopover
            schedule={_schedule}
            onCreateOrder={handleCellSelect}
          >
            <CellButton>{getTimeFromSeconds(_schedule.time)}</CellButton>
          </ScheduleCellPopover>
        ))}
      </DayRowCells>
    </DayRowContainer>
  );
}

type ScheduleProps = {
  readonly scheduleList: TSchedule[];
  readonly onTimeSelect?: (_: TSchedule) => void;
};

export function Schedule({ scheduleList, onTimeSelect }: ScheduleProps) {
  const handleCellSelect = (schedule: TSchedule) => {
    onTimeSelect?.(schedule);
  };

  const groupedSchedule = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(
          groupByKey<TSchedule>(
            [...scheduleList].sort((prev, next) => prev.time - next.time),
            (_s: TSchedule) => `${_s.day_id}:${_s.year}`
          )
        ).sort(([prevDateString], [currentDateString]) => {
          const [prevDayId, prevYear] = prevDateString.split(":", 2);
          const [currentDayId, currentYear] = currentDateString.split(":", 2);

          const currentDate = getByDayId(+currentDayId, +currentYear);
          const prevDate = getByDayId(+prevDayId, +prevYear);

          return currentDate.isBefore(prevDate) ? 1 : 0;
        })
      ),
    [scheduleList]
  );

  return (
    <Stack
      direction={{ base: "column", lg: "row" }}
      separator={<StackSeparator />}
      gap={5}
      alignItems={{ base: "center", lg: "baseline" }}
      justifyContent={{ base: "center", lg: "start" }}
    >
      {Object.entries(groupedSchedule).map(([dateString, scheduleArray]) => {
        const [dayId, year] = dateString.split(":", 2);
        return (
          <DayRow
            dayId={+dayId}
            schedule={scheduleArray}
            year={+year}
            onCellSelect={handleCellSelect}
          />
        );
      })}
    </Stack>
  );
}
