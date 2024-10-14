export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isRegistrationFinished: boolean;
  registration: {
    finished: boolean;
    information: {
      stepName: string;
      [key: string]: string;
    }[];
    lastStep: string;
  };
}
