import React from "react";
import { TActor, TFilmActor } from "../types";
import { Button, Card, Stack, Image, Text, EmptyState, VStack } from "@chakra-ui/react";
import {MdOutlinePersonOutline} from 'react-icons/md';

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
    )
}
export function ActorsCard({ filmActor }: ActorCardProps) {
  return (
    <Card.Root size="sm">
      <Image src={filmActor.actor.photo_url} objectFit="cover" width={200} height={200} borderRadius="sm" />
      <Card.Body>
        <Card.Title>
          {filmActor.actor.first_name} {filmActor.actor.last_name}
        </Card.Title>
        <Text color="gray.500">{filmActor.role}</Text>
      </Card.Body>
    </Card.Root>
  );
}

export function ActorsList({ filmActors }: ActorsListProps) {
  return (
    <Stack gap={5} wrap="wrap" direction="row">
      {filmActors.map((actor) => (
        <ActorsCard filmActor={actor} key={actor.id} />
      ))}
    </Stack>
  );
}
