import { useUnit } from "effector-react";
import { useEffect } from "react";
import { Card, Separator, Stack, Spinner } from "@chakra-ui/react";
import { $user } from "../../effector/users.store";
import {
  BonusLogsList,
  BonusesHelpCards,
  BonusInfo,
} from "../../components/bonuses";
import {
  $bonusesInfo,
  $bonusesLoading,
  loadUserBonusesEv,
} from "../../effector/bonuses.store";

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
      <BonusesHelpCards />
      <BonusLogsList logs={bonuses?.logs || []} />
    </Stack>
  );
}
