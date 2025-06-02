import {
  chakra,
  Card,
  Stack,
  IconButton,
  Box,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";


export type FormStageProps<T> = {
  readonly onSubmit?: (_: T) => void;
  readonly error?: string;
  readonly onError?: (_: string) => void;
};

export const BackButton = chakra(
  IconButton,
  {
    base: {
      position: "absolute",
      left: 5,
      top: 2,
    },
  },
  {
    defaultProps: { variant: "ghost", children: <FaArrowLeft /> },
  }
);

export const FormContainer = chakra(
  Card.Root,
  {
    base: {
      borderRadius: "10px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      paddingX: "25px",
      paddingY: "20px",
      _open: {
        animation: "fade-in 500ms ease-out",
      },
    },
  },
  {
    defaultProps: { width: "sm", "data-state": "open" },
  }
);

type AuthFormContainerProps = {
  readonly children: React.ReactNode[] | React.ReactNode;
  readonly onBack?: () => void;
};

export function AuthFormContainer({ children, onBack }: AuthFormContainerProps) {
  return (
    <Box position="relative" minH="60vh">
      <AbsoluteCenter axis="both">
        <FormContainer>
            {!!onBack && (
                <BackButton onClick={() => onBack?.()} />
            )}
            {children}
        </FormContainer>
      </AbsoluteCenter>
    </Box>
  );
}
