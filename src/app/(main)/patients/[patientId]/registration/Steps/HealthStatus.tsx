import React from "react";
import { VStack, Text } from "@chakra-ui/react";
import { 
  translateDiagnosedIllness, 
  translateMedication, 
  translateWeightLossMeds 
} from "@/i18n/translate";

const HealthStatusStep = ({
  data,
}: {
  data: {
    diagnosedIllness: string | number;
    medication: string | number;
    weightLossMeds: string | number;
  };
}) => {
  return (
    <VStack alignItems={"flex-start"}>
      <Text>Enfermedad Diagnosticada: {translateDiagnosedIllness(data.diagnosedIllness)}</Text>
      <Text>Medicación: {translateMedication(data.medication)}</Text>
      <Text>Medicación para bajar de peso: {translateWeightLossMeds(data.weightLossMeds)}</Text>
    </VStack>
  );
};

export default HealthStatusStep;
