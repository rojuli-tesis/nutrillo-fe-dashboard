import React, { useEffect } from "react";
import { VStack, Text } from "@chakra-ui/react";
import { entries, flatten, flattenDepth, keys } from "lodash";
import { translateFoodItem, translateSectionName } from "@/i18n/translate";

const DietStep = ({
  data,
}: {
  data: {
    [key: string]: any;
    stepName: string;
  }[];
}) => {
  const renderSection = (
    sectionName: string,
    sectionData: { [key: string]: any },
  ) => {
    return (
      <VStack>
        <h1>{sectionName}</h1>
        <pre>{JSON.stringify(sectionData, null, 2)}</pre>
      </VStack>
    );
  };

  const info = flattenDepth(data.map(({ stepName, ...rest }) => rest));
  const subSections = flatten(info.map(keys));

  const renderSelectedItemsForSection = (section: string) => {
    const d = info.find((item) => item[section]);
    if (!d[section]?.length) {
      return "";
    }
    return d[section].map(translateFoodItem).join(", ");
  };

  return (
    <VStack alignItems={"flex-start"}>
      {subSections.map((section) => (
        <Text key={section}>
          {translateSectionName(section)}:{" "}
          {renderSelectedItemsForSection(section)}
        </Text>
      ))}
    </VStack>
  );
};

export default DietStep;
