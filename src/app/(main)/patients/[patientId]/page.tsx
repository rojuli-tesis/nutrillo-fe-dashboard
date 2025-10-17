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
  Badge,
  Flex,
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
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
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
          <CardFooter>
            <Button onClick={() => router.push(`/patients/${params.patientId}/meal-logs`)}>
              Ver registros de comidas
            </Button>
          </CardFooter>
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
            <Flex justifyContent={"space-between"} alignItems={"center"} w={"100%"}>
              <Badge colorScheme={patientData.isRegistrationFinished ? "green" : "red"}>{
                patientData.isRegistrationFinished ? "Completado" : "En proceso"
              }</Badge>
              <Button disabled={!patientData.isRegistrationFinished} onClick={redirectToRegistrationPage}>
                Ver formulario
              </Button>
            </Flex>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Text
              style={{
                fontWeight: "bold",
              }}
              fontSize={"2xl"}
            >
              Plan nutricional
            </Text>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push(`/patients/${params.patientId}/nutrition-plan`)}>
              Ver/Agregar documentos
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Text
              style={{
                fontWeight: "bold",
              }}
              fontSize={"2xl"}
            >
              Platos y recetas guardados
            </Text>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push(`/patients/${params.patientId}/saved-plates`)}>
              Ver platos y recetas
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Text
              style={{
                fontWeight: "bold",
              }}
              fontSize={"2xl"}
            >
              Instrucciones personalizadas
            </Text>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push(`/patients/${params.patientId}/custom-instructions`)}>
              Gestionar instrucciones
            </Button>
          </CardFooter>
        </Card>
      </Grid>
    </Box>
  );
};

export default PatientPage;
