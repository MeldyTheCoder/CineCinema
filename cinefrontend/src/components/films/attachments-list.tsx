import { Box, Image, Stack } from "@chakra-ui/react";
import Masonry from "react-masonry-css";
import { TFilmAttachment } from "../../types";
import { createGlobalStyle } from "styled-components";
import { useMemo } from "react";
import { parseUrl } from "../../utils/urls";
import { AttachmentsEmptyState } from "./attachments-empty-state";

const MasonryStyles = createGlobalStyle`
  .my-masonry-grid {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-left: -16px;
    width: auto;
  }
  .my-masonry-grid_column {
    padding-left: 16px;
    background-clip: padding-box;
    outline: none;
  }
`;

const breakpointColumnsObj = {
  default: 2,
  1200: 3,
  900: 2,
  600: 1,
};

type AttachmentListProps = {
  readonly attachments: TFilmAttachment[];
};

export function AttachmentsList({ attachments }: AttachmentListProps) {
  const trailer = useMemo<TFilmAttachment | undefined>(
    () => attachments.find((attachment) => attachment.mimeType === "video"),
    [attachments]
  );
  const images = useMemo<TFilmAttachment[]>(
    () => attachments.filter((attachment) => attachment.mimeType === "photo"),
    [attachments]
  );

  if (!attachments || !attachments.length) {
    return <AttachmentsEmptyState />;
  }

  return (
    <Stack gap={2}>
      {!!trailer && (
        <video
          autoPlay
          muted
          loop
          height="200px"
          style={{ borderRadius: "15px" }}
        >
          <source src={parseUrl(trailer.attachmentUrl)} />
        </video>
      )}
      <Box>
        <MasonryStyles />
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {images.map((attachment) => (
            <Box
              key={attachment.id}
              mb={4}
              transition="0.3s all"
              _hover={{ transform: "scale(1.02)" }}
            >
              <Image
                src={parseUrl(attachment.attachmentUrl)}
                w="full"
                h="auto"
                minH={`${Math.random() * 300 + 200}px`}
                borderRadius="md"
                loading="lazy"
                cursor="pointer"
              />
            </Box>
          ))}
        </Masonry>
      </Box>
    </Stack>
  );
}
