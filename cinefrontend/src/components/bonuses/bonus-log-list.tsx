import { For, Stack } from "@chakra-ui/react";
import { TBonusLog } from "../../types";
import { BonusLogCard } from "../profile/bonus-logs-list";

type BonusLogsListProps = {
  readonly logs: TBonusLog[];
};

export function BonusLogsList({ logs }: BonusLogsListProps) {
  return (
    <Stack gap={5} direction="column">
      <For each={logs}>{(log) => <BonusLogCard log={log} />}</For>
    </Stack>
  );
}
