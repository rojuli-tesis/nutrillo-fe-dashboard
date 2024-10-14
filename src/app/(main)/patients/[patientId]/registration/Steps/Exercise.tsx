import React from "react";
import { VStack, Text } from "@chakra-ui/react";

const ExerciseStep = ({
  data,
}: {
  data: {
    sedentaryLevel: number;
    workouts: any[];
  };
}) => {
  return (
    <VStack>
      <Text>Nivel de actividad: {data.sedentaryLevel}</Text>
      {/*  TODO:  Render workouts */}
    </VStack>
  );
};

export default ExerciseStep;
