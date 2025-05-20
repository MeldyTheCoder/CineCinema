import {
  Card,
  VStack,
  Button,
  chakra,
  Text,
  Separator,
  IconButton,
  Flex,
  HStack,
  Group,
} from "@chakra-ui/react";
import { useUnit } from "effector-react";
import React from "react";
import { FaMoneyBill } from "react-icons/fa6";
import {
  IoSettingsOutline,
  IoLogOutOutline,
  IoStarOutline,
} from "react-icons/io5";
import { LuListOrdered } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import { $user, logoutFx } from "../../effector/users.store.ts";
import { Avatar } from "../ui/avatar";
import { IoMdSunny } from "react-icons/io";
import {HiSupport} from 'react-icons/hi';

const NavButton = chakra(
  Button,
  {
    base: {
      fontSize: "16px",
      width: "100%",
      textAlign: "start",
      alignSelf: "start",
      justifyContent: "start",
    },
  },
  {
    defaultProps: {
      variant: "ghost",
    },
  }
);

type TMenuButton = {
  readonly to: string;
  readonly children: React.ReactNode;
};

function MenuButton({ to, children }: TMenuButton) {
  return (
    <NavLink
      to={to}
      end
      style={{ width: "100%" }}
      children={({ isActive }) => (
        <NavButton colorPalette={isActive ? "purple" : undefined} borderLeft={isActive ? "2px solid purple" : undefined}>
          {children}
        </NavButton>
      )}
    />
  );
}
export function ProfileSidebar() {
  const [user] = useUnit([$user]);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutFx().then(() => navigate('/'))
  }
  return (
    <Card.Root justifyContent="start" textAlign="start" padding="15px">
      <Flex justifyContent="space-between">
        <HStack gap={2}>
          <Avatar size="xs" src={user ? `http://localhost:8080/media/${user.avatar}` : undefined} />
          <Text textStyle="md">{user?.firstName}</Text>
        </HStack>
        <Group>
          <IconButton variant="ghost" size="xs">
            <IoMdSunny />
          </IconButton>
          <IconButton variant="ghost" colorPalette="red" size="xs" onClick={handleLogout}>
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
