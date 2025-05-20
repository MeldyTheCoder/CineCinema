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
    width: "80%",
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
  }
});

const MessageContainer = chakra(
  Card.Root,
  {
    base: {
      fontSize: "18px",
      padding: "5px 15px",
      borderRadius: "15px",
      maxWidth: '75%',
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
  return (
    <MessageContainer
      alignSelf={isMine ? "flex-end" : "flex-start"}
      bg={isMine ? "purple.900" : "gray.800"}
    >
      <Text fontSize="18px">{text}</Text>
      <Text fontSize="10px" color="gray.300" alignSelf="flex-end">
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
  }, [bottomRef.current])

  return (
    <MessagesContainer>
      <Flex direction="column" gap={2} width="100%">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <>
            <Separator marginTop="2rem" />
            <Text textAlign="center">{date}</Text>
            {messages.map((message) => (
              <Message
                isMine={message.isMine}
                text={message.text}
                dateTime={message.dateTime}
              />
            ))}
            <div ref={bottomRef} />
          </>
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
    isMine: true,
    text: "Как дела твои?",
    dateTime: "2025-05-17 22:44:20",
  },
  {
    isMine: true,
    text: "Что делаешь?",
    dateTime: "2025-05-17 22:44:30",
  },
  {
    isMine: false,
    text: "Привет, мир!!!",
    dateTime: "2025-05-17 23:44:40",
  },
  {
    isMine: false,
    text: "Все чики пики",
    dateTime: "2025-05-17 23:44:50",
  },
  {
    isMine: false,
    text: "Нахуя я сам с собой переписываюсь.",
    dateTime: "2025-05-17 23:44:55",
  },
  {
    isMine: true,
    text: "Вот так вот и бывает, когда друзей нет :(",
    dateTime: "2025-05-18 22:44:14",
  },
  {
    isMine: true,
    text: "Переночевав в гостинице в Гуаякиле, мы сели к агенту в машину и поехали на судно в Пуэрто Боливар. Доехали вопреки ожиданиям быстро, примерно за 3-4 часа. Погода была пасмурная и даже не смотря на то, что мы находимся недалеко от экватора, было прохладно. Почти все время, пока мы ехали, по обе стороны дороги были банановые плантации, но все равно в голове не укладывается: эти бананы грузят на суда в нескольких портах Эквадора десятками тысяч тонн каждый день, круглый год. Это ж несчастные бананы должны расти быстрее чем грибы.",
    dateTime: "2025-05-18 22:44:00",
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
            <Button bg="bg.subtle" variant="outline" borderRightRadius="15px" size="lg">
              Отправить
            </Button>
          </Group>
        </VStack>
      </SupportWrapper>
    </SupportRoot>
  );
}
