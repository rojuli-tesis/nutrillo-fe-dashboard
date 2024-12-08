import React from "react";
import { VStack, Text } from "@chakra-ui/react";
import { getActivityLevelLabel } from "@/i18n/translate";

const ExerciseStep = ({
  data,
}: {
  data: {
    sedentaryLevel: number;
    workouts: any[];
  };
}) => {
  const renderWorkout = (workout: any) => {
    return <div>wkt</div>;
  };
  return (
    <VStack>
      <Text>
        Nivel de actividad: {getActivityLevelLabel(data.sedentaryLevel)}
      </Text>
      {/* TODO: fill in workouts to write render fn */}
      {data.workouts.map(renderWorkout)}
    </VStack>
  );
};

export default ExerciseStep;
