import React from "react";
import { Text, VStack } from "@chakra-ui/react";
import { flatten, flattenDepth, keys } from "lodash";
import { translateRoutineStep, translateRoutineValue } from "@/i18n/translate";

const RoutineStep = ({
  data,
}: {
  data: {
    [key: string]: any;
    stepName: string;
  }[];
}) => {
  const info = flattenDepth(data.map(({ stepName, ...rest }) => rest));
  const labels = flatten(info.map(keys));

  const renderSelectedItemsForSection = (section: string) => {
    return "";
  };

  return (
    <VStack alignItems={"flex-start"}>
      {info.map((section, index) =>
        Object.entries(section).map(([key, value]) => (
          <Text key={key}>
            {translateRoutineStep(key)}: {translateRoutineValue(value as string)}
          </Text>
        )),
      )}
    </VStack>
  );
};

export default RoutineStep;
