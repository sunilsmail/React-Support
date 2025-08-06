import React, { useState } from "react";
import styled from "styled-components";
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  Cell,
} from "@vds/tables";
import { Input } from "@vds/inputs";
import { PxIcon } from "@vds/icons";
import PropTypes from "prop-types";

const Container = styled.div`
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StyledInput = styled(Input)`
  max-width: 200px;
  height: 32px;
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  color: #0071eb;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
`;

const GenerateLink = styled.a`
  color: #0071eb;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

const StyledTable = styled(Table)`
  font-size: 14px;

  thead {
    background: #f5f5f5;
  }

  th,
  td {
    padding: 8px 12px !important;
    white-space: nowrap;
  }

  tr {
    height: 44px;
  }

  .selected-row {
    border-bottom: 3px solid orange;
  }

  .radio-cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input[type="radio"] {
    accent-color: black;
    width: 16px;
    height: 16px;
  }
`;

function DunsTable({ data, onSelect }) {
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");

  const handleRowSelect = (dunsLocId) => {
    setSelectedId(dunsLocId);
    onSelect?.(dunsLocId);
  };

  const filteredData = data.filter((item) =>
    item.dunsLocId.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => {
    setSearch("");
  };

  return (
    <Container>
      <Header>
        <ResetButton onClick={handleReset}>Reset all</ResetButton>
        <SearchWrapper>
          <StyledInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="XXXXXXXXX"
            suffix={<PxIcon icon="search" size="s" />}
          />
        </SearchWrapper>
        <GenerateLink href="#">Generate new DUNs number</GenerateLink>
      </Header>

      <StyledTable surface="light" padding="compact">
        <TableHead>
          <TableHeader />
          <TableHeader>DUNS ID</TableHeader>
          <TableHeader>Business Name</TableHeader>
          <TableHeader>Contact Name</TableHeader>
          <TableHeader>Phone Number</TableHeader>
          <TableHeader>Employee Count</TableHeader>
          <TableHeader>Address</TableHeader>
        </TableHead>
        <TableBody>
          {filteredData?.length > 0 ? (
            filteredData.map((row) => {
              const isSelected = selectedId === row.dunsLocId;
              return (
                <TableRow
                  key={row.dunsLocId}
                  onClick={() => handleRowSelect(row.dunsLocId)}
                  className={isSelected ? "selected-row" : ""}
                  style={{ cursor: "pointer" }}
                >
                  <Cell className="radio-cell">
                    <input
                      type="radio"
                      name="dunsSelect"
                      checked={isSelected}
                      onChange={() => handleRowSelect(row.dunsLocId)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Cell>
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
              );
            })
          ) : (
            <TableRow>
              <Cell colSpan={7} style={{ textAlign: "center" }}>
                No records found
              </Cell>
            </TableRow>
          )}
        </TableBody>
      </StyledTable>
    </Container>
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
