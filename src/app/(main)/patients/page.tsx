"use client";

import SimpleTable from "@/components/table/SimpleTable";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import InviteModal from "./InviteModal";
import { Invite } from "@/shared/interfaces/invites";
import restClient from "@/utils/restClient";
import { LinkIcon } from "@chakra-ui/icons";
import InviteStatusBadge from "@/components/Badges/InviteStatusBadge";

const PatientsPage = () => {
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
  const [pendingInvites, setPendingInvites] = React.useState<Invite[]>([]);
  const toast = useToast();

  const loadInvites = async () => {
    const data = await restClient.get<Invite[]>("/invite?status=pending");
    setPendingInvites(data);
  };

  useEffect(() => {
    loadInvites();
  }, [inviteModalOpen]);

  const handleCopyInviteLink = (code: string) => {
    navigator.clipboard.writeText(`http://localhost:3001/invite/${code}`);
    toast({
      title: "Link copiado!",
      description: "Link para invitar paciente fue copiado al portapapeles",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  return (
    <Box
      style={{
        padding: "16px 32px",
      }}
    >
      <Text fontSize="4xl" as={"h1"}>
        Mis pacientes
      </Text>
      <Grid
        style={{
          marginTop: "16px",
        }}
      >
        <GridItem
          style={{
            marginBottom: "16px",
          }}
        >
          <Flex justify="flex-end">
            <Button onClick={() => setInviteModalOpen(true)} colorScheme="teal">
              Invitar paciente
            </Button>
          </Flex>
        </GridItem>
        <GridItem>
          <Accordion allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  Invitaciones Pendientes ({pendingInvites.length})
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <SimpleTable
                  headers={[
                    { value: "firstName", title: "Nombre" },
                    { value: "lastName", title: "Apellido" },
                    { value: "email", title: "Email" },
                    {
                      value: "status",
                      title: "Estado",
                      cellRenderer: (row) => (
                        <InviteStatusBadge status={row.status} />
                      ),
                    },
                    {
                      value: "code",
                      title: "Link",
                      cellRenderer: (row) => (
                        <Button
                          size="sm"
                          onClick={() => handleCopyInviteLink(row.code)}
                        >
                          <LinkIcon boxSize={3} />
                        </Button>
                      ),
                    },
                  ]}
                  data={pendingInvites}
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </GridItem>
      </Grid>
      {inviteModalOpen && (
        <InviteModal onClose={() => setInviteModalOpen(false)} />
      )}
    </Box>
  );
};

export default PatientsPage;
