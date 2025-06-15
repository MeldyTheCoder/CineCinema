import {
  Card,
  VStack,
  Text,
  Separator,
  IconButton,
  Flex,
  HStack,
  Group,
} from "@chakra-ui/react";
import { useUnit } from "effector-react";
import { FaMoneyBill } from "react-icons/fa6";
import {
  IoSettingsOutline,
  IoLogOutOutline,
  IoStarOutline,
} from "react-icons/io5";
import { LuListOrdered } from "react-icons/lu";
import { $user, logoutFx } from "../../effector/users.store.ts";
import { Avatar } from "../ui/avatar";
import { IoMdSunny } from "react-icons/io";
import { HiSupport } from "react-icons/hi";
import { useColorMode } from "../ui/color-mode.tsx";
import { MenuButton, NavButton } from "./menu-button.tsx";

export function ProfileSidebar() {
  const { toggleColorMode } = useColorMode();
  const [user] = useUnit([$user]);

  const handleLogout = () => {
    logoutFx().then(() => (window.location.href = "/"));
  };

  return (
    <Card.Root justifyContent="start" textAlign="start" padding="15px">
      <Flex justifyContent="space-between">
        <HStack gap={2}>
          <Avatar
            size="xs"
            src={
              user ? `http://localhost:8080/media/${user.avatar}` : undefined
            }
          />
          <Text textStyle="md">{user?.firstName}</Text>
        </HStack>
        <Group>
          <IconButton
            variant="ghost"
            size="xs"
            onClick={() => toggleColorMode()}
          >
            <IoMdSunny />
          </IconButton>
          <IconButton
            variant="ghost"
            colorPalette="red"
            size="xs"
            onClick={handleLogout}
          >
            <IoLogOutOutline />
          </IconButton>
        </Group>
      </Flex>

      <Separator marginY="1rem" />

      <VStack gap="1rem" alignItems="start">
        <VStack alignItems="start">
          <Text fontWeight="bold" textStyle="lg">
            Основные
          </Text>
          <MenuButton to="/profile/purchases/">
            <LuListOrdered />
            Покупки
          </MenuButton>
          <MenuButton to="/profile/reviews/">
            <IoStarOutline />
            Мои отзывы
          </MenuButton>
          <MenuButton to="/profile/bonuses/">
            <FaMoneyBill />
            Бонусная программа
          </MenuButton>
          <MenuButton to="/profile/support/">
            <HiSupport />
            Поддержка
          </MenuButton>
        </VStack>

        <Separator />

        <VStack alignItems="start">
          <Text fontWeight="bold" textStyle="lg">
            Профиль
          </Text>
          <MenuButton to="/profile/">
            <IoSettingsOutline />
            Настройки профиля
          </MenuButton>
          <NavButton onClick={handleLogout}>
            <IoLogOutOutline />
            Выйти
          </NavButton>
        </VStack>
      </VStack>
    </Card.Root>
  );
}
