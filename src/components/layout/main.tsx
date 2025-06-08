"use client";
import {
  Box,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { MdOutlineLogout } from "react-icons/md";
import { ChevronDownIcon } from "@chakra-ui/icons";

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
        <Box style={{ display: "flex", alignItems: "center" }}>
          <Link style={MenuLinkStyle} as={NextLink} href="/dashboard">
            <img src="logo.svg" alt="nutrillo" />
          </Link>
          <Menu>
            <MenuButton style={MenuLinkStyle}>
              Mis pacientes
              <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              <MenuItem
                style={{
                  color: "teal",
                  fontWeight: "bold",
                }}
                as={NextLink}
                href={"/patients"}
              >
                Pacientes
              </MenuItem>
              <MenuItem
                style={{
                  color: "teal",
                  fontWeight: "bold",
                }}
                as={NextLink}
                href={"/invites"}
              >
                Invitaciones
              </MenuItem>
            </MenuList>
          </Menu>
          <Link style={MenuLinkStyle} as={NextLink} href="/ingredients">
            Ingredientes
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
