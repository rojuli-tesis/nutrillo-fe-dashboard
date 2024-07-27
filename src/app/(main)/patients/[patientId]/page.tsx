"use client";
import React, { useEffect, useState } from "react";
import restClient from "@/utils/restClient";
import { useParams } from "next/navigation";
import { Patient } from "@/shared/interfaces/patients";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
} from "@chakra-ui/react";

const PatientPage = () => {
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
      <Text fontSize="4xl">
        {patientData.firstName} {patientData.lastName}
      </Text>
    </Box>
  );
};

export default PatientPage;
