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
  Text,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import StepResponse from "@/app/(main)/patients/[patientId]/registration/StepResponse";
import Notes from "@/app/(main)/patients/[patientId]/registration/Notes";

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
    <Box
      style={{
        padding: "16px 32px",
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
      {patientData.registration.information
        //   TODO: fix typescript
        .reduce((acc, info) => {
          if (info.stepName.includes("diet")) {
            const existing = acc.find((item) => item.stepName === "diet");
            if (existing) {
              existing.data = [...existing.data, info];
              return acc;
            } else {
              const temp = {
                stepName: "diet",
                data: [info],
              };
              return [...acc, temp];
            }
          }
          if (info.stepName.includes("routine")) {
            const existing = acc.find((item) => item.stepName === "routine");
            if (existing) {
              existing.data = [...existing.data, info];
              return acc;
            } else {
              const temp = {
                stepName: "routine",
                data: [info],
              };
              return [...acc, temp];
            }
          }
          return [...acc, info];
        }, [])
        .map((info, index) => (
          <Grid templateColumns="40% 60% " key={info.stepName}>
            <StepResponse data={info} />
            <Notes stepName={info.stepName} />
          </Grid>
        ))}
    </Box>
  );
};

export default Page;
