import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
} from "@chakra-ui/react";
import React from "react";

const SimpleTable = <T extends object>({
  headers,
  data,
}: {
  headers: (keyof T)[];
  data: T[];
}) => {
  return (
    <Box
      style={{
        background: "white",
        borderRadius: "10px",
      }}
    >
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              {headers.map((header) => (
                <Th key={header.toString()}>{header.toString()}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, idx) => (
              <Tr key={idx}>
                {headers.map((header) => (
                  <Td key={header.toString()}>{String(row[header])}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SimpleTable;
