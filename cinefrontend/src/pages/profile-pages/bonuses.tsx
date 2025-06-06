import { useUnit } from "effector-react";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Center,
  chakra,
  Group,
  Progress,
  Separator,
  Text,
  Stack,
  VStack,
  Spinner,
  Badge,
  FormatNumber,
} from "@chakra-ui/react";
import { Avatar } from "../../components/ui/avatar";
import { $user } from "../../effector/users.store";
import { UserHeaderCard } from "../../components/profile/user-header-card";
import { TBonusLog, TBonusResponse, TUser } from "../../types";
import { films, users } from "../../test";
import {
  BonusesHelperCards,
  BonusLogsList,
} from "../../components/profile/bonus-logs-list";
import {
  $bonusesInfo,
  $bonusesLoading,
  loadUserBonusesEv,
} from "../../effector/bonuses.store";
import { FaCoins, FaClipboardList, FaLevelUpAlt } from "react-icons/fa";

const LevelSpan = chakra("span", {
  base: {
    fontSize: "24px",
  },
});

const XpSpan = chakra("span", {
  base: {
    fontSize: "16px",
    color: "gray.400",
    textAlign: "center",
  },
});

const FullNameSpan = chakra("h1", {
  base: {
    fontWeight: "bold",
    fontSize: "24px",
  },
});

export function BonusInfo({
  user,
  bonuses,
}: {
  readonly user: TUser;
  readonly bonuses: TBonusResponse;
}) {
  return (
    <Stack gap={2}>
      <Avatar
        width={150}
        height={150}
        src={`http://localhost:8080/media/${user.avatar}`}
        alignSelf="center"
      />
      <FullNameSpan textAlign="center">
        {user.firstName} {user.lastName}
      </FullNameSpan>
      <Group justifyContent="center" width="100%">
        <Badge colorPalette="green" size="lg">
          <FaCoins />
          <FormatNumber value={bonuses.currentBonuses / 100} />
        </Badge>
        <Badge colorPalette="purple" size="lg">
          <FaLevelUpAlt />
          {bonuses.levelInfo.level}
        </Badge>
      </Group>
      <Group gap={5}>
        <LevelSpan>{bonuses?.levelInfo.level}</LevelSpan>
        <Progress.Root
          width="100%"
          colorPalette="purple"
          defaultValue={bonuses?.levelInfo.progress}
        >
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
        <LevelSpan>{bonuses?.levelInfo.level + 1}</LevelSpan>
      </Group>

      <XpSpan>{bonuses?.levelInfo.currentXp} XP</XpSpan>
    </Stack>
  );
}
export function ProfileBonuses() {
  const [user, loadBonuses, bonuses, loading] = useUnit([
    $user,
    loadUserBonusesEv,
    $bonusesInfo,
    $bonusesLoading,
  ]);

  useEffect(() => {
    loadBonuses();
  }, []);

  if (!user) {
    return null;
  }

  if (!bonuses || loading) {
    return <Spinner />;
  }

  return (
    <Stack width="100%" gap={5}>
      <Card.Root padding="30px" borderRadius="20px" width="100%">
        <BonusInfo user={user} bonuses={bonuses} />
      </Card.Root>

      <Separator />

      <BonusesHelperCards />

      <BonusLogsList logs={bonuses?.logs || []} />
    </Stack>
  );
}
