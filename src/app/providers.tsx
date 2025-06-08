"use client";

import { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import dayjs from "dayjs";
import "dayjs/locale/es";

// Configure dayjs
dayjs.locale("es");

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  );
} 