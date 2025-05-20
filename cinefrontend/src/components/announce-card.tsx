import { TAnnounce } from "../types";
import { chakra, Heading, Text, Image, Card, Badge } from "@chakra-ui/react";
import { HiStar } from "react-icons/hi"

type AnnounceCard = {
  readonly announce: TAnnounce;
};

const ImageContainer = chakra(Card.Root, {
  base: {
    position: "relative",
    borderRadius: "md",
  },
});

const DescriptionsContent = chakra("div", {
  base: {
    position: "absolute",
    top: "80%",
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
  { defaultProps: { variant: "solid", colorPalette: "blue", children: <><HiStar /> Новинка</>, size: 'lg'} }
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
  { defaultProps: { variant: "solid", colorPalette: "orange", children: <><HiStar /> Премьера</>, size: 'lg'} }
);

export function AnnounceCard({ announce }: AnnounceCard) {
  return (
    <ImageContainer transition="scale 0.3s" _hover={{scale: 1.03}}>
      <Image
        src={announce.coverUrl}
        width={700}
        height={370}
        aspectRatio="16x9"
        objectFit="cover"
        borderRadius="inherit"
      />
      <SoonTag />
      <DescriptionsContent>
        <Heading>{announce.title}</Heading>
        <Text>{announce.text}</Text>
      </DescriptionsContent>
    </ImageContainer>
  );
}
