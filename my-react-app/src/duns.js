import React, { useState, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
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
import { Button } from "@vds/buttons";

// Styled Components

const Container = styled.div`
  padding: 1rem;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
`;

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const StyledInput = styled(Input)`
  width: 200px;
  height: 32px;
`;

const ResetLink = styled.button`
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

const Tooltip = styled.div`
  margin-top: 0.5rem;
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #ccc;
  max-width: 400px;
  font-size: 14px;
  border-radius: 4px;
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

function DUNSTable({ data, onSelect }) {
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [alternateDUN, setAlternateDUN] = useState("");
  const [isHiddenTooltip, setIsHiddenTooltip] = useState(true);
  const [isValidDUN, setIsValidDUN] = useState(true);
  const [isDisabledDUN, setIsDisabledDUN] = useState(false);
  const inputRef = useRef(null);

  const handleRowSelect = (dunsLocId) => {
    setSelectedId(dunsLocId);
    onSelect?.(dunsLocId);
  };

  const filteredData = data.filter((item) =>
    item.dunsLocId.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => {
    setSearch("");
    setAlternateDUN("");
    setIsHiddenTooltip(true);
    setIsValidDUN(true);
    setSelectedId("");
  };

  const handleSearchChange = (e) => setSearch(e.target.value);
  const onClickAlternateDUN = () => setIsHiddenTooltip(false);
  const onClickCloseDUN = () => setIsHiddenTooltip(true);

  const onClickSubmitEmpCount = () => {
    const count = parseInt(alternateDUN, 10);
    if (isNaN(count) || count < 1) {
      setIsValidDUN(false);
    } else {
      setIsValidDUN(true);
      setIsDisabledDUN(true);
      // Submit logic here
    }
  };

  const onChangeAlternateDUN = (e) => {
    setAlternateDUN(e.target.value);
    setIsValidDUN(true);
    setIsDisabledDUN(false);
  };

  return (
    <Container>
      <StyledHeader>
        <HeaderWrapper>
          <SearchSection>
            <ResetLink onClick={handleReset}>Reset all</ResetLink>
            <StyledInput
              value={search}
              onChange={handleSearchChange}
              placeholder="XXXXXXXXX"
              suffix={<PxIcon icon="search" size="s" />}
              maxLength="9"
            />
            {search !== "" && search.length < 9 && (
              <span style={{ fontSize: "12px", color: "red" }}>
                Please enter a valid 9 digit DUNS ID
              </span>
            )}
          </SearchSection>
          <GenerateLink onClick={onClickAlternateDUN}>
            Generate new DUNs number
          </GenerateLink>
        </HeaderWrapper>

        {!isHiddenTooltip && (
          <Tooltip>
            <div>Enter the number of Employees of the business</div>
            <div style={{ marginTop: "0.5rem" }}>
              <div>Employee count</div>
              <input
                type="text"
                value={alternateDUN}
                onChange={onChangeAlternateDUN}
                ref={inputRef}
                className={`Form-input ${!isValidDUN ? "errorInput" : ""}`}
                style={{ width: "100%", padding: "6px", marginTop: "4px" }}
              />
              {!isValidDUN && (
                <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                  Please enter an employee count greater than 1.
                </div>
              )}
            </div>
            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
              <Button variant="secondary" onClick={onClickCloseDUN}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={isDisabledDUN}
                onClick={onClickSubmitEmpCount}
              >
                Submit
              </Button>
            </div>
          </Tooltip>
        )}
      </StyledHeader>

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
          {filteredData.length > 0 ? (
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
                    {[
                      row.businessAddress?.addressLine1,
                      row.businessAddress?.city,
                      row.businessAddress?.state,
                    ]
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

DUNSTable.propTypes = {
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

export default DUNSTable;
