import React, { useState } from "react";
import { Box, Card, Textarea, useToast } from "@chakra-ui/react";
import restClient from "@/utils/restClient";

const Notes = ({
  initialValue = "",
  stepName,
  userId,
}: {
  initialValue?: string;
  stepName: string;
  userId: number;
}) => {
  const [storedNotes, setStoredNotes] = useState(initialValue);
  const [notes, setNotes] = useState(initialValue);
  const toast = useToast();
  const saveChanges = async () => {
    if (notes === storedNotes) {
      return;
    }
    const { success } = await restClient.patch<{ success: boolean }>(
      `/patient/${userId}/registration-notes`,
      {
        notes,
        section: stepName,
      },
    );
    if (success) {
      setStoredNotes(notes);
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
        height: "100%",
        margin: "0 0 0 16px",
      }}
    >
      <Card style={{ padding: "12px", height: "100%" }}>
        <Textarea
          style={{
            height: "100%",
          }}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveChanges}
          placeholder={"Notas"}
        />
      </Card>
    </Box>
  );
};

export default Notes;
