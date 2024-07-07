import { Center } from "@chakra-ui/react";
import React from "react";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Center backgroundColor="gray.100" height="100%">
      {children}
    </Center>
  );
};

export default LoginLayout;
