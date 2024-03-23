import { ButtonProps, Button as ChackraButton } from "@chakra-ui/react";
import React from "react";

// This is a custom button component that wraps the Chakra UI Button component.
// Workaround because at the moment there's a bug on the library skipping disabled prop
const Button = ({ children, disabled, onClick, ...props }: ButtonProps) => {
  const handleClick = (p: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!disabled && onClick) {
      onClick(p);
    }
  };

  const disabledStyles = {
    background: "gray.300 !important",
    color: "gray.600",
    cursor: "not-allowed",
  };

  const styles = {
    ...props.style,
    ...(disabled && disabledStyles),
  };

  return (
    <ChackraButton
      {...props}
      disabled={disabled}
      sx={styles}
      onClick={handleClick}
    >
      {children}
    </ChackraButton>
  );
};

export default Button;
