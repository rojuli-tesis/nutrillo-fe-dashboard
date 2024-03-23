"use client";
import { Box, Flex, Icon, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { MdOutlineLogout } from "react-icons/md";

const MenuLinkStyle = {
  padding: "16px",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  align: "center",
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box background="gray.100" h="100%">
      <Flex background="teal.700" justify="space-between" align="center">
        <Box>
          <Link style={MenuLinkStyle} as={NextLink} href="/dashboard">
            Dashboard
            {/* TODO: reemplazar por logo */}
          </Link>
          <Link style={MenuLinkStyle} as={NextLink} href="/patients">
            Mis pacientes
          </Link>
        </Box>
        <Link style={MenuLinkStyle} as={NextLink} href="/logout">
          Cerrar Sesion
          <Icon boxSize={4} as={MdOutlineLogout} />
        </Link>
      </Flex>
      {children}
    </Box>
  );
};

export default MainLayout;
