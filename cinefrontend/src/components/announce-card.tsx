import { TAnnounce } from "../types";
import { chakra, Heading, Text, Image, Card, Badge } from "@chakra-ui/react";
import { HiStar } from "react-icons/hi"
import { parseUrl } from "../utils/urls";

type AnnounceCard = {
  readonly announce: TAnnounce;
  readonly onClick?: (_: TAnnounce) => void;
};

const ImageContainer = chakra(Card.Root, {
  base: {
    position: "relative",
    borderRadius: "md",
    width: {base: '100%', lg: "510px", xl: '510px'},
    height: {base: 'auto', lg: "350px", xl: '350px'},
    maxWidth: {base: '100%', lg: "510px", xl: '510px'},
    maxHeight: {base: 'auto', lg: "350px", xl: '350px'},
  },
});

const DescriptionsContent = chakra("div", {
  base: {
    position: "absolute",
    top: "75%",
    left: "5%",
  },
});

const NewTag = chakra(
  Badge,
  {
    base: {
      position: "absolute",
      top: "4%",
      left: "3%",
    },
  },
  { defaultProps: { variant: "solid", colorPalette: "orange", children: <><HiStar /> Премьера</>, size: 'lg'} }
);

const SoonTag = chakra(
  Badge,
  {
    base: {
      position: "absolute",
      top: "4%",
      left: "3%",
    },
  },
  { defaultProps: { variant: "solid", colorPalette: "blue", children: <><HiStar /> Скоро в прокате</>, size: 'lg'} }
);

export function AnnounceCard({ announce, onClick }: AnnounceCard) {
  return (
    <ImageContainer transition="scale 0.3s" _hover={{scale: 1.03}} onClick={() => onClick?.(announce)}>
      <Image
        src={parseUrl(announce.coverUrl)}
        width="inherit"
        height="inherit"
        aspectRatio="16x9"
        objectFit="cover"
        borderRadius="inherit"
      />
      {!announce.film?.id ? <SoonTag /> : <NewTag />}
      <DescriptionsContent>
        <Heading color="white">{announce.title}</Heading>
        <Text color="white">{announce.text}</Text>
      </DescriptionsContent>
    </ImageContainer>
  );
}
