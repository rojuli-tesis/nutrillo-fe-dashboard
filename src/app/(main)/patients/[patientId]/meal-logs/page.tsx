"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Image,
  Badge,
  Flex,
  Spinner,
  Center,
  Button,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import restClient from "@/utils/restClient";
import { Patient } from "@/shared/interfaces/patients";
import { MealLog } from "@/types/meals";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const MealLogsPage = () => {
  const params = useParams<{ patientId: string }>();
  const [patientData, setPatientData] = useState<Patient>();
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGroupedView, setIsGroupedView] = useState(false);

  const loadData = async () => {
    try {
      const [patientResponse, logsResponse] = await Promise.all([
        restClient.get<Patient>(`/patient/${params.patientId}`),
        restClient.get<MealLog[]>(`/food-log/patient/${params.patientId}`),
      ]);
      setPatientData(patientResponse);
      setMealLogs(logsResponse);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.patientId]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  if (!patientData) {
    return null;
  }

  const translateMealType = (type: string) => {
    const translations: { [key: string]: string } = {
      breakfast: "Desayuno",
      morningSnack: "Merienda mañana",
      lunch: "Almuerzo",
      afternoonSnack: "Merienda tarde",
      dinner: "Cena",
      eveningSnack: "Merienda noche",
    };
    return translations[type] || type;
  };

  const getDayLabel = (date: string) => {
    const today = dayjs();
    const yesterday = dayjs().subtract(1, 'day');
    const inputDate = dayjs(date);

    if (inputDate.isSame(today, 'day')) {
      return "Hoy";
    } else if (inputDate.isSame(yesterday, 'day')) {
      return "Ayer";
    } else {
      return inputDate.locale('es').format('DD [de] MMMM');
    }
  };

  const groupLogsByDate = (logs: MealLog[]) => {
    return logs.reduce((groups, log) => {
      const date = dayjs(log.date).format('YYYY-MM-DD');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
      return groups;
    }, {} as { [key: string]: MealLog[] });
  };

  const renderMealCard = (log: MealLog) => (
    <Card key={log._id} size="sm">
      <CardHeader py={3}>
        <Flex justify="space-between" align="center">
          <Badge colorScheme="teal" fontSize="xs">{translateMealType(log.mealType)}</Badge>
          <Text fontSize="xs" color="gray.500">
            {dayjs(log.date).locale("es").format("HH:mm")}
          </Text>
        </Flex>
      </CardHeader>
      <CardBody py={3}>
        {log.photoUrl && (
          <Box mb={2}>
            <Image
              src={log.photoUrl}
              alt="Meal"
              borderRadius="md"
              objectFit="cover"
              maxH="150px"
              w="100%"
            />
          </Box>
        )}
        {log.description && (
          <Text fontSize="sm" noOfLines={2}>{log.description}</Text>
        )}
      </CardBody>
    </Card>
  );

  const groupedLogs = groupLogsByDate(mealLogs);

  return (
    <Box p={8} h="calc(100vh - 50px)" display="flex" flexDirection="column">
      <Breadcrumb mb={4}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/patients">Pacientes</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/patients/${params.patientId}`}>
            {patientData.firstName} {patientData.lastName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Registros de comidas</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Flex justify="space-between" align="center" mb={6}>
        <Heading color="teal.500" size="lg">
          Registros de comidas - {patientData.firstName} {patientData.lastName}
        </Heading>
        <Button
          leftIcon={isGroupedView ? <ViewOffIcon /> : <ViewIcon />}
          onClick={() => setIsGroupedView(!isGroupedView)}
          colorScheme="teal"
          variant="outline"
          size="sm"
        >
          {isGroupedView ? "Vista mosaico" : "Vista por fecha"}
        </Button>
      </Flex>

      <Box flex="1" overflowY="auto" pr={2} pb={4} minH="0">
        {mealLogs.length === 0 ? (
          <Card>
            <CardBody>
              <Text>No hay registros de comidas disponibles.</Text>
            </CardBody>
          </Card>
        ) : isGroupedView ? (
          <VStack spacing={4} align="stretch">
            {Object.entries(groupedLogs)
              .sort(([dateA], [dateB]) => dayjs(dateB).diff(dayjs(dateA)))
              .map(([date, logs]) => (
                <Box key={date}>
                  <Text fontSize="lg" fontWeight="bold" mb={3}>
                    {getDayLabel(date)}
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={4}>
                    {logs.map(renderMealCard)}
                  </SimpleGrid>
                  <Divider mt={4} />
                </Box>
              ))}
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={4}>
            {mealLogs.map(renderMealCard)}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
};

export default MealLogsPage; 