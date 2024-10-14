import React from "react";
import { VStack, Text } from "@chakra-ui/react";

const HealthStatusStep = ({
  data,
}: {
  data: {
    diagnosedIllness: string;
    medication: string;
    weightLossMeds: string;
  };
}) => {
  return (
    <VStack alignItems={"flex-start"}>
      <Text>Enfermedad Diagnosticada: {data.diagnosedIllness}</Text>
      <Text>Medicación: {data.medication}</Text>
      <Text>Medicación para bajar de peso: {data.weightLossMeds}</Text>
    </VStack>
  );
};

export default HealthStatusStep;
