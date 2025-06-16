import { useMemo, useRef, useEffect } from "react";
import {
  Button,
  Card,
  chakra,
  Flex,
  Group,
  Input,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { groupByKey } from "../../utils/arrays";
import { getCurrentDate } from "../../utils/dates";
import { Avatar } from "../../components/ui/avatar";
import { styled } from "styled-components";
import { useColorModeValue } from "../../components/ui/color-mode";

const SupportHeader = chakra(Card.Root, {
  base: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gapX: "10px",
    justifyContent: "start",
    width: "100%",
    bg: "gray.950",
    padding: "15px 40px",
    borderRadius: 0,
    borderTopRadius: "15px",
    _light: {
      bg: 'gray.100',
    }
  },
});

const SupportRoot = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const SupportWrapper = chakra("div", {
  base: {
    width: {lg: "80%", base: '100%'},
    justifySelf: "center",
    borderColor: "gray.900",
    // borderWidth: '2px',
    // borderStyle: 'solid',
    // borderTopRadius: '10px',
  },
});

const MessagesContainer = chakra("div", {
  base: {
    maxHeight: "65vh",
    overflowY: "auto",
    justifySelf: "center",
    width: "85%",
  },
});

const MessageContainer = chakra(
  Card.Root,
  {
    base: {
      fontSize: "18px",
      padding: "5px 15px",
      borderRadius: "15px",
      maxWidth: "75%",
    },
  },
  {
    defaultProps: { variant: "subtle" },
  }
);

type MessageProps = {
  readonly isMine: boolean;
  readonly text: string;
  readonly dateTime: string;
};

type MessagesProps = {
  readonly messages: MessageProps[];
};

function Message({ isMine, text, dateTime }: MessageProps) {
  const incomingMessageBg = useColorModeValue('purple.300', 'purple.900');
  const outcomingMessageBg = useColorModeValue('gray.100', 'gray.800');

  return (
    <MessageContainer
      alignSelf={isMine ? "flex-end" : "flex-start"}
      bg={isMine ? incomingMessageBg : outcomingMessageBg}
    >
      <Text fontSize="18px">{text}</Text>
      <Text fontSize="10px" color="fg.muted" alignSelf="flex-end">
        {dayjs(dateTime).format("HH:MM")}
      </Text>
    </MessageContainer>
  );
}

function Messages({ messages }: MessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const groupedMessages = useMemo(
    () =>
      groupByKey(
        messages.sort((prev, current) =>
          dayjs(current.dateTime).isBefore(dayjs(prev.dateTime!)) ? 1 : -1
        ),
        (message) => {
          const currentDate = getCurrentDate();
          const parsedDate = dayjs(message.dateTime);
          if (parsedDate.year() !== currentDate.year()) {
            return parsedDate.format("DD MMMM YYYY");
          }
          return parsedDate.format("DD MMMM");
        }
      ),
    [messages]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [bottomRef.current]);

  return (
    <MessagesContainer>
      <Flex direction="column" gap={7} width="100%">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <Flex direction="column" gap={5}>
            <Flex direction="column" gap={2}>
              <Separator />
              <Text textAlign="center" color="fg.muted">
                {date}
              </Text>
            </Flex>
            <Flex direction="column" gap={2}>
              {messages.map((message) => (
                <Message
                  isMine={message.isMine}
                  text={message.text}
                  dateTime={message.dateTime}
                />
              ))}
            </Flex>
            <div ref={bottomRef} />
          </Flex>
        ))}
      </Flex>
    </MessagesContainer>
  );
}

const messagesList: MessagesProps["messages"] = [
  {
    isMine: true,
    text: "Привет, мир",
    dateTime: "2025-05-17 22:44:10",
  },
  {
    isMine: false,
    text: "Привет, мир!!!",
    dateTime: "2025-05-17 23:44:40",
  },
  {
    isMine: true,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    dateTime: "2025-05-17 23:44:40",
  },
  {
    isMine: false,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    dateTime: "2025-05-17 23:44:40",
  },
];

export function Support() {
  return (
    <SupportRoot>
      <SupportWrapper>
        <VStack gap={5}>
          <SupportHeader>
            <Avatar width="50px" height="50px" />
            <Text textStyle="xl">Техническая поддержка</Text>
          </SupportHeader>
          <Messages messages={messagesList} />
          <Group attached w="full" width="90%" borderRadius="15px">
            <Input
              width="100%"
              placeholder="Сообщение"
              borderLeftRadius="15px"
              size="lg"
            />
            <Button
              bg="bg.subtle"
              variant="outline"
              borderRightRadius="15px"
              size="lg"
            >
              Отправить
            </Button>
          </Group>
        </VStack>
      </SupportWrapper>
    </SupportRoot>
  );
}
