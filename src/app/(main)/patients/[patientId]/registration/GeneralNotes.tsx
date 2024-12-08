import React, { useState } from "react";
import { Box, Card, Textarea, Text, useToast } from "@chakra-ui/react";
import restClient from "@/utils/restClient";

const GeneralNotes = ({
  initialValue = "",
  userId,
}: {
  initialValue?: string;
  patientId: number;
}) => {
  const [notes, setNotes] = useState(initialValue);
  const toast = useToast();
  const saveChanges = async () => {
    const { success } = await restClient.patch(
      `/patient/${userId}/registration-notes`,
      {
        notes,
      },
    );
    if (success) {
      toast({
        title: "Notas guardadas",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };
  return (
    <Box
      style={{
        marginBottom: "12px",
      }}
    >
      <Card style={{ padding: "12px" }}>
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          Notas:
        </Text>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveChanges}
          placeholder={"Notas"}
        />
      </Card>
    </Box>
  );
};

export default GeneralNotes;
