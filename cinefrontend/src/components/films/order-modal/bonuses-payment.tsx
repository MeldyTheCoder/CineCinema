import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Alert,
  Button,
  useEditable,
  Icon,
  Stat,
  Flex,
  Separator,
  chakra,
  FormatNumber,
} from "@chakra-ui/react";
import { useUnit } from "effector-react";
import {
  $bonusesInfo,
  $bonusesLoading,
  loadUserBonusesEv,
} from "../../../effector/bonuses.store";
import { useEffect } from "react";
import { FaCoins } from "react-icons/fa6";
import { FaLevelUpAlt } from "react-icons/fa";

type BonusesPaymentProps = {
  readonly totalPrice: number;
  readonly onSubmit: () => void;
};

const BonusPriceText = chakra('strong', {
    base: {
        display: 'flex',
        flexDirection: 'row',
        gap: '2px',
        alignItems: 'center',
        width: 'fit-content',
    }
});

export function BonusesPayment({ totalPrice, onSubmit }: BonusesPaymentProps) {
  const [bonusInfo, loading] = useUnit([$bonusesInfo, $bonusesLoading]);

  useEffect(() => {
    loadUserBonusesEv();
  }, []);

  return (
    <Box>
      <VStack align="stretch" gap={4}>
        <Flex gap={2} direction="column" width="100%">
          <HStack justifyContent="space-between" direction="row">
            <Text fontSize="lg">Ваш уровень</Text>
            <Separator direction="row" borderStyle="dashed" flex="1" />
            <Badge colorPalette="purple" size="lg">
              <FaLevelUpAlt />
              {bonusInfo?.levelInfo.level!}
            </Badge>
          </HStack>

          <HStack justifyContent="space-between" direction="row">
            <Text fontSize="lg">Кол-во доступных бонусов</Text>
            <Separator direction="row" borderStyle="dashed" flex="1" />
            <Badge colorPalette="green" size="lg">
              <FaCoins />
              <FormatNumber value={bonusInfo?.currentBonuses! / 100} />
            </Badge>
          </HStack>
        </Flex>

        <Alert.Root status="info" variant="subtle">
          <Alert.Indicator />
          <Box>
            <Text fontWeight="bold">
              Оплата бонусами возможна только на <strong>100%</strong>
            </Text>
            <Text fontSize="sm">
              Вы не можете частично оплатить заказ бонусами
            </Text>
          </Box>
        </Alert.Root>

        <Button
          disabled={bonusInfo?.currentBonuses! < totalPrice}
          onClick={() => onSubmit()}
          borderRadius="15px"
          gap={2}
        >
          Списать
          <BonusPriceText>
            <Icon size="xs" colorPalette="green">
              <FaCoins />
            </Icon>
            {totalPrice / 100}
          </BonusPriceText>
        </Button>

        {bonusInfo?.currentBonuses! < totalPrice && (
          <Text color="red.500" fontSize="sm" textWrap="nowrap">
            Недостаточно бонусов. Для оплаты нужно еще{" "}
            <BonusPriceText>
              <Icon size="xs">
                <FaCoins />
              </Icon>
              {(totalPrice - bonusInfo?.currentBonuses!) / 100}{" "}
            </BonusPriceText>
          </Text>
        )}
      </VStack>
    </Box>
  );
}
