import React from "react";
import { InviteStatus } from "@/shared/interfaces/invites";
import { Badge } from "@chakra-ui/react";

const InviteStatusBadge = ({ status }: { status: InviteStatus }) => {
  const translated = {
    [InviteStatus.PENDING]: "Pendiente",
    [InviteStatus.ACCEPTED]: "Aceptada",
    [InviteStatus.REVOKED]: "Revocada",
    [InviteStatus.EXPIRED]: "Expirada",
  };

  const statusColors = {
    [InviteStatus.PENDING]: "yellow",
    [InviteStatus.ACCEPTED]: "green",
    [InviteStatus.REVOKED]: "red",
    [InviteStatus.EXPIRED]: "orange",
  };

  return <Badge colorScheme={statusColors[status]}>{translated[status]}</Badge>;
};

export default InviteStatusBadge;
