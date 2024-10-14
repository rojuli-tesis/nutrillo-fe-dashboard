import React from "react";
import { VStack, Text } from "@chakra-ui/react";
import { differenceInYears, format } from "date-fns";

const PersonalDataStep = ({
  data,
}: {
  data: {
    firstName: string;
    lastName: string;
    objectives: string;
    dob: string;
  };
}) => {
  return (
    <VStack alignItems={"flex-start"}>
      <Text>Nombre: {data.firstName}</Text>
      <Text>Apellido: {data.lastName}</Text>
      <Text>Objetivos: {data.objectives}</Text>
      <Text>
        Fecha de nacimiento: {format(data.dob, "dd/MM/yyyy")} - (Edad:{" "}
        {differenceInYears(new Date(), data.dob)})
      </Text>
    </VStack>
  );
};

export default PersonalDataStep;
