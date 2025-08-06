import Table, {
  TableHead,
  TableHeader,
  CellStyle,
  TableBody,
  TableRow,
  Cell,
} from "@vds/tables";
import PropTypes from "prop-types";
import React, { useState } from "react";

function DunsTable({ data, onSelect }) {
  const [selecteddunsLocId, setSelecteddunsLocId] = useState('');

  const handleSelection = (dunsLocId) => {
    setSelecteddunsLocId(dunsLocId);
    if (onSelect) onSelect(dunsLocId);
  };

  if (!data || data.length === 0) {
    return <p>No matching business found.</p>;
  }

  return (
    <Table striped={false} surface="light" padding="standard">
      <TableHead>
        <TableHeader><CellStyle>Select</CellStyle></TableHeader>
        <TableHeader><CellStyle>DUNS</CellStyle></TableHeader>
        <TableHeader><CellStyle>Business Name</CellStyle></TableHeader>
        <TableHeader><CellStyle>Address</CellStyle></TableHeader>
        <TableHeader><CellStyle>Contact Name</CellStyle></TableHeader>
        <TableHeader><CellStyle>Contact Number</CellStyle></TableHeader>
        <TableHeader><CellStyle>Employee Count</CellStyle></TableHeader>
      </TableHead>

      <TableBody>
        {data.map((record) => (
          <TableRow key={record.dunsLocId}>
            <Cell>
              <input
                type="radio"
                name="dunSelect"
                value={record.dunsLocId}
                checked={selecteddunsLocId === record.dunsLocId}
                onChange={() => handleSelection(record.dunsLocId)}
              />
            </Cell>
            <Cell>{record.dunsLocId}</Cell>
            <Cell>{record.businessName}</Cell>
            <Cell>{record?.businessAddress?.addressLine1 || '-'}</Cell>
            <Cell>{record?.contactName || '-'}</Cell>
            <Cell>{record?.phoneNumber || '-'}</Cell>
            <Cell>{record?.employeeCount || '-'}</Cell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

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
