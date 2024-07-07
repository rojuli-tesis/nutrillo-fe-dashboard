"use client";

import React, { useEffect, useState } from "react";
import {
  Text,
  Box,
  Button,
  IconButton,
  useToast,
  Card,
  CardBody,
} from "@chakra-ui/react";
import RegularTable from "@/components/table/RegularTable";
import { Invite, InviteStatus } from "@/shared/interfaces/invites";
import { ColumnDef } from "@tanstack/react-table";
import restClient from "@/utils/restClient";
import InviteStatusBadge from "@/components/Badges/InviteStatusBadge";
import InviteModal from "@/app/(main)/patients/InviteModal";
import { LinkIcon, SmallCloseIcon, TimeIcon } from "@chakra-ui/icons";

const InvitesPage = () => {
  const [allInvites, setAllInvites] = useState<Invite[]>([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const toast = useToast();

  const loadInvites = async () => {
    const data = await restClient.get<Invite[]>("/invite");
    setAllInvites(data);
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const canRevoke = (invite: Invite) => {
    return invite.status === InviteStatus.PENDING;
  };

  const canExtend = (invite: Invite) => {
    return invite.status === InviteStatus.EXPIRED;
  };

  const extendInvite = async (id: number) => {
    await restClient.patch(`/invite/${id}/extend`);
    loadInvites();
  };

  const revokeInvite = async (id: number) => {
    await restClient.patch(`/invite/${id}/revoke`);
    loadInvites();
  };

  const canUse = (invite: Invite) => {
    return invite.status === InviteStatus.PENDING;
  };

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

  const tableColumns: ColumnDef<Invite>[] = [
    {
      header: "Nombre",
      accessorFn: (row: Invite) => `${row.firstName} ${row.lastName}`,
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Estado",
      accessorKey: "status",
      cell: ({ getValue }) => {
        return <InviteStatusBadge status={getValue() as InviteStatus} />;
      },
    },
    {
      header: "",
      id: "actions",
      cell: ({ row }) => {
        return (
          <Box style={{ columnGap: "4px", display: "flex" }}>
            {canUse(row.original) && (
              <IconButton
                aria-label={"copy"}
                size="xs"
                icon={<LinkIcon />}
                colorScheme="blue"
                onClick={() => handleCopyInviteLink(row.original.code)}
              />
            )}
            {canRevoke(row.original) && (
              <IconButton
                size="xs"
                aria-label="revoke"
                colorScheme={"red"}
                icon={<SmallCloseIcon />}
                onClick={() => revokeInvite(row.original.id)}
              />
            )}
            {canExtend(row.original) && (
              <IconButton
                size="xs"
                aria-label="extend"
                colorScheme={"green"}
                icon={<TimeIcon />}
                onClick={() => extendInvite(row.original.id)}
              />
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box
      style={{
        padding: "16px 32px",
      }}
    >
      <Text fontSize="4xl" as={"h1"}>
        Mis invitaciones
      </Text>
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <Button colorScheme="teal" onClick={() => setInviteModalOpen(true)}>
          Invitar paciente
        </Button>
      </Box>
      <Box>
        <Card>
          <CardBody>
            <RegularTable columns={tableColumns} data={allInvites} />
          </CardBody>
        </Card>
      </Box>
      {inviteModalOpen && (
        <InviteModal
          onClose={() => {
            setInviteModalOpen(false);
            loadInvites();
          }}
        />
      )}
    </Box>
  );
};

export default InvitesPage;
