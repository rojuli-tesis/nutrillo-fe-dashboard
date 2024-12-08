import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import PersonalDataStep from "./Steps/PersonalData";
import CurrentStatusStep from "./Steps/CurrentStatus";
import DietStep from "./Steps/Diet";
import HealthStatusStep from "./Steps/HealthStatus";
import ExerciseStep from "./Steps/Exercise";
import RoutineStep from "./Steps/Routine";
import LifestyleStep from "./Steps/Lifestyle";
import { renderStepName } from "@/i18n/translate";

const renderStep = (data: any, stepName: string) => {
  switch (stepName) {
    case "personalData":
      return <PersonalDataStep data={data} />;
    case "currentStatus":
      return <CurrentStatusStep data={data} />;
    case "healthStatus":
      return <HealthStatusStep data={data} />;
    case "diet":
      return <DietStep data={data.data} />;
    case "exercise":
      return <ExerciseStep data={data} />;
    case "routine":
      return <RoutineStep data={data.data} />;
    case "lifestyle":
      return <LifestyleStep data={data} />;
    default:
      return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }
};

const StepResponse = ({
  data,
}: {
  data: {
    stepName: string;
    [key: string]: any;
  };
}) => {
  return (
    <VStack
      style={{
        borderRadius: "4px",
        padding: "16px",
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
        }}
      >
        {renderStepName(data.stepName)}
      </Text>
      <Box style={{ width: "100%" }}>{renderStep(data, data.stepName)}</Box>
    </VStack>
  );
};

export default StepResponse;
