"use client";
import React, { useEffect, useState } from "react";
import restClient from "@/utils/restClient";
import { useParams, useRouter } from "next/navigation";
import { Patient } from "@/shared/interfaces/patients";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  CardFooter,
  CardHeader,
  Grid,
  Text,
} from "@chakra-ui/react";
import Button from "@/components/Button";

const PatientPage = () => {
  const params = useParams<{ patientId: string }>();
  const router = useRouter();

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

  const redirectToRegistrationPage = () => {
    router.push(`/patients/${params.patientId}/registration`);
  };

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
        {patientData.firstName} {patientData.lastName}
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <Card>
          <CardHeader>
            <Text
              style={{
                fontWeight: "bold",
              }}
              fontSize={"2xl"}
            >
              Diario de registros
            </Text>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Text
              style={{
                fontWeight: "bold",
              }}
              fontSize={"2xl"}
            >
              Formulario inicial
            </Text>
          </CardHeader>

          <CardFooter>
            {patientData.isRegistrationFinished && (
              <Button onClick={redirectToRegistrationPage}>
                Ver formulario
              </Button>
            )}
          </CardFooter>
        </Card>
      </Grid>
    </Box>
  );
};

export default PatientPage;
