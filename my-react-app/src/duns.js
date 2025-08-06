import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  Cell,
} from "@vds/tables";
import PropTypes from "prop-types";

const DunsTable = ({ data, onSelect }) => {
  const [selectedId, setSelectedId] = useState("");

  const handleRowClick = (dunsLocId) => {
    setSelectedId(dunsLocId);
    onSelect?.(dunsLocId);
  };

  return (
    <Table surface="light" padding="standard">
      <TableHead>
        <TableHeader>DUNS ID</TableHeader>
        <TableHeader>Business Name</TableHeader>
        <TableHeader>Contact Name</TableHeader>
        <TableHeader>Phone Number</TableHeader>
        <TableHeader>Employee Count</TableHeader>
        <TableHeader>Address</TableHeader>
      </TableHead>
      <TableBody>
        {data?.length > 0 ? (
          data.map((row) => (
            <TableRow
              key={row.dunsLocId}
              onClick={() => handleRowClick(row.dunsLocId)}
              selected={selectedId === row.dunsLocId}
              style={{ cursor: "pointer" }}
            >
              <Cell>{row.dunsLocId}</Cell>
              <Cell>{row.businessName || "-"}</Cell>
              <Cell>{row.contactName || "-"}</Cell>
              <Cell>{row.phoneNumber || "-"}</Cell>
              <Cell>{row.employeeCount ?? "-"}</Cell>
              <Cell>
                {[row.businessAddress?.addressLine1, row.businessAddress?.city, row.businessAddress?.state]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </Cell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <Cell colSpan={6} style={{ textAlign: "center" }}>
              No records found
            </Cell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

DunsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      dunsLocId: PropTypes.string.isRequired,
      businessName: PropTypes.string,
      contactName: PropTypes.string,
      phoneNumber: PropTypes.string,
      employeeCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      businessAddress: PropTypes.shape({
        addressLine1: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
      }),
    })
  ).isRequired,
  onSelect: PropTypes.func,
};

export default DunsTable;
