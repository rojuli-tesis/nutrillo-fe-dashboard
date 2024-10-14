import React from "react";
import { VStack, Text } from "@chakra-ui/react";

const CurrentStatusStep = ({
  data,
}: {
  data: {
    activityLevel: string;
    dietType: string;
    height: number;
    weight: number;
  };
}) => {
  return (
    <VStack alignItems="flex-start">
      <Text>Actividad: {data.activityLevel}</Text>
      <Text>Tipo de dieta: {data.dietType}</Text>
      <Text>Altura: {data.height}cm</Text>
      <Text>Peso: {data.weight}kg</Text>
    </VStack>
  );
};
export default CurrentStatusStep;
