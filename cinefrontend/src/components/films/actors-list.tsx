import React from "react";
import { TActor, TFilmActor } from "../../types";
import {
  Button,
  Card,
  Stack,
  Image,
  Text,
  EmptyState,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { MdOutlinePersonOutline } from "react-icons/md";
import { Avatar } from "../ui/avatar";

type ActorCardProps = {
  readonly filmActor: TFilmActor;
};

type ActorsListProps = {
  readonly filmActors: TFilmActor[];
};

export function ActorsListEmptyState() {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <MdOutlinePersonOutline />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>Актеры не найдены.</EmptyState.Title>
          <EmptyState.Description>
            Вероятнее всего актеров данного фильма не удалось найти.
          </EmptyState.Description>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}

export function Actor({ filmActor }: ActorCardProps) {
  return (
    <Stack gap={2} alignItems="center" transition="scale 0.3s" _hover={{scale: 1.05}}>
      <Avatar src={filmActor.actor.photoUrl} width="90px" height="90px" />

      <Stack gap="0px" alignItems="center">
        <Heading lineHeight="22px" fontSize="18px">
          {filmActor.actor.firstName} {filmActor.actor.lastName}
        </Heading>
        <Text color="gray.400">{filmActor.role}</Text>
      </Stack>
    </Stack>
  );
}

export function ActorsList({ filmActors }: ActorsListProps) {
  return (
    <Stack gap={5} wrap="wrap" direction="row">
      {filmActors.map((actor) => (
        <Actor filmActor={actor} key={actor.id} />
      ))}
    </Stack>
  );
}
