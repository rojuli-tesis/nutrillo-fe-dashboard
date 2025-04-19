"use client";

import React, { useEffect, useState } from "react";
import { Patient } from "@/shared/interfaces/patients";
import restClient from "@/utils/restClient";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Grid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import StepResponse from "@/app/(main)/patients/[patientId]/registration/StepResponse";
import Notes from "@/app/(main)/patients/[patientId]/registration/Notes";
import { reduceRegistrationData } from "./helper";
import GeneralNotes from "./GeneralNotes";

const Page = () => {
  const params = useParams<{ patientId: string }>();

  const [patientData, setPatientData] = useState<Patient>();

  const loadPatientData = async () => {
    const data = await restClient.get<Patient>(`/patient/${params.patientId}`);
    setPatientData(data);
  };

  useEffect(() => {
    loadPatientData();
  }, []);

  if (!patientData) {
    return null;
  }
  return (
    <Grid
      templateRows={"auto auto 1fr"}
      style={{
        padding: "16px 32px",
        overflow: "hidden",
        height: "calc(100% - 56px)",
      }}
    >
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href={"/"}>Inicio</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={"/patients"}>Pacientes</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href={`/patients/${params.patientId}`}>
            {patientData.firstName} {patientData.lastName}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Text
        fontSize="4xl"
        color="teal.500"
        style={{
          textTransform: "capitalize",
          fontWeight: "bold",
          padding: "16px 0",
        }}
      >
        {patientData.firstName} {patientData.lastName} - Formulario de registro
      </Text>
      <Box
        style={{
          overflow: "scroll",
          paddingBottom: "36px",
        }}
      >
        <GeneralNotes
          initialValue={patientData.registration.notes}
          userId={+params.patientId}
        />
        {reduceRegistrationData(patientData.registration.information).map(
          (info) => (
            <Grid
              templateColumns="40% 60% "
              style={{
                margin: "16px 0",
              }}
              key={info.stepName}
            >
              <StepResponse data={info} />
              <Notes
                stepName={info.stepName}
                initialValue={info.notes}
                userId={+params.patientId}
              />
            </Grid>
          ),
        )}
      </Box>
    </Grid>
  );
};

export default Page;
