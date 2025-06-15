import { Badge, chakra, FormatNumber, Group, Progress, Stack } from "@chakra-ui/react";
import { TBonusResponse, TUser } from "../../types";
import { Avatar } from "../ui/avatar";
import { FaCoins, FaLevelUpAlt } from "react-icons/fa";

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