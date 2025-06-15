import { useUnit } from "effector-react";
import { $user, logoutFx } from "../../effector/users.store";
import { useColorMode } from "../ui/color-mode";
import { Drawer, Flex, Group, HStack, IconButton, Portal, Separator, Text, VStack } from "@chakra-ui/react";
import { IoMdSunny } from "react-icons/io";
import { IoLogOutOutline, IoSettingsOutline, IoStarOutline } from "react-icons/io5";
import { MenuButton, NavButton } from "./menu-button";
import { FaMoneyBill } from "react-icons/fa";
import { LuListOrdered } from "react-icons/lu";
import { HiSupport } from "react-icons/hi";
import { Avatar } from "../ui/avatar";
import { parseUrl } from "../../utils/urls";

export function ProfileDrawer({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const {toggleColorMode} = useColorMode();
  const [user] = useUnit([$user]);

  const handleLogout = () => {
    logoutFx().then(() => (window.location.href = "/"));
  };

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Flex justifyContent="space-between" width="100%">
                <HStack gap={2}>
                  <Avatar
                    size="xs"
                    src={
                      user
                        ? parseUrl(user.avatar)
                        : undefined
                    }
                  />
                  <Text textStyle="md">{user?.firstName}</Text>
                </HStack>
                <Group>
                  <IconButton variant="ghost" size="xs" onClick={() => toggleColorMode()}>
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
            </Drawer.Header>
            <Drawer.Context>
              {(store) => (
                <Drawer.Body>
                  <VStack gap="1rem" alignItems="start" onClickCapture={() => store.setOpen(false)}>
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
                </Drawer.Body>
              )}
            </Drawer.Context>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}