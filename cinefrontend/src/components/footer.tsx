import {
  Badge,
  Box,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";
import { FaCopyright, FaDocker, FaReact } from "react-icons/fa";
import { SiFastapi, SiMysql, SiNginx } from "react-icons/si";
import {DiRedis} from 'react-icons/di';
import { getCurrentDate } from "../utils/dates";

export function Footer() {
  const textColor = useColorModeValue("black", "white");

  return (
    <Box
      w="100%"
      mt="3rem"
      py={4}
      px={{lg: "13rem", base: '0'}}
      bg="bg.panel"
      color={textColor}
      boxShadow="md"
    >
      <Flex mx="auto" justify={{base: 'center', lg: 'space-between'}} align="center">
        <Box>
          <HStack align="stretch" gap={2}>
            <Text fontSize="xl" letterSpacing="tighter" fontWeight="bold">
              CineCinema
            </Text>

              <HStack align="center" gap="5px" color="fg.muted">
                <FaCopyright />
                <Text fontSize="md">{getCurrentDate().year()}</Text>
              </HStack>
          </HStack>
        </Box>

        <Flex align="center" fontSize="sm" gap={3} display={{base: 'none', lg: 'flex'}}>
          <FaDocker size="25" color="#0362F5" />
          <FaReact size="25" color="#53C0DD" />
          <SiFastapi size="25" color="#019286" />
          <SiNginx size="25" color="#009900" />
          <SiMysql size="25" color="#00566D" />
          <DiRedis size="25" color="#C8302B" />
        </Flex>
      </Flex>
    </Box>
  );
}
