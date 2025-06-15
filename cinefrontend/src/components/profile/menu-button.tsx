import { Button, chakra } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

type TMenuButton = {
  readonly to: string;
  readonly children: React.ReactNode;
};

export const NavButton = chakra(
  Button,
  {
    base: {
      fontSize: "16px",
      width: "100%",
      textAlign: "start",
      alignSelf: "start",
      justifyContent: "start",
    },
  },
  {
    defaultProps: {
      variant: "ghost",
    },
  }
);

export function MenuButton({ to, children }: TMenuButton) {
  return (
    <NavLink
      to={to}
      end
      style={{ width: "100%" }}
      children={({ isActive }) => (
        <NavButton
          colorPalette={isActive ? "purple" : undefined}
          borderLeft={isActive ? "2px solid purple" : undefined}
        >
          {children}
        </NavButton>
      )}
    />
  );
}