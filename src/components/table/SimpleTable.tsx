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
import React, { ReactNode } from "react";

const SimpleTable = <T extends object>({
  headers,
  data,
}: {
  headers: {
    value: keyof T;
    title: string;
    cellRenderer?: (cellData: T) => string | ReactNode;
  }[];
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
                <Th key={header.value.toString()}>{header.title}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, idx) => (
              <Tr key={idx}>
                {headers.map((header) => (
                  <Td key={header.toString()}>
                    {header.cellRenderer
                      ? header.cellRenderer(row)
                      : String(row[header.value])}
                  </Td>
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
