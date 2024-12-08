import React from "react";
import { VStack, Text, Divider } from "@chakra-ui/react";
import { translateFrequency } from "@/i18n/translate";

const Lifestyle = ({
  data,
}: {
  data: {
    [key: string]: any;
    stepName: string;
  };
}) => {
  return (
    <VStack alignItems={"flex-start"}>
      <Text>Alcohol: {translateFrequency(data.alcohol)}</Text>
      {data.alcoholDetails && <Text>Detalles: {data.alcoholDetails}</Text>}
      <Divider />
      <Text>Fuma: {translateFrequency(data.smoking)}</Text>
      {data.smokingDetails && <Text>Detalles: {data.smokingDetails}</Text>}
      <Divider />
      <Text>Suplementos: {translateFrequency(data.supplements)}</Text>
      {data.supplementsDetails && (
        <Text>Detalles: {data.supplementsDetails}</Text>
      )}
    </VStack>
  );
};

export default Lifestyle;
