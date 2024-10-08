export enum InviteStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REVOKED = "REVOKED",
  EXPIRED = "EXPIRED",
}

export interface Invite {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  code: string;
  status: InviteStatus;
}
