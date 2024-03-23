"use client";

import SimpleTable from "@/components/table";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import InviteModal from "./InviteModal";
import { Invite } from "@/shared/interfaces/invites";
import restClient from "@/utils/restClient";

const PatientsPage = () => {
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
  const [pendingInvites, setPendingInvites] = React.useState<Invite[]>([]);

  const loadInvites = async () => {
    const data = await restClient.get<Invite[]>("/invite");
    setPendingInvites(data);
  };

  useEffect(() => {
    loadInvites();
  }, [inviteModalOpen]);

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
                  headers={["firstName", "lastName", "email", "status"]}
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
