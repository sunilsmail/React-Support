import React from 'react';

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'Arial, sans-serif',
  },
  th: {
    textAlign: 'left',
    fontWeight: 'bold',
    padding: '12px 16px',
    borderBottom: '2px solid black',
  },
  td: {
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '4px solid orange', // Bottom border as shown in image
  },
  trHover: {
    backgroundColor: '#f9f9f9',
  },
  radio: {
    transform: 'scale(1.2)',
  },
};

function StyledTable({ data, selectedId, onSelect }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}></th>
          <th style={styles.th}>DUNs</th>
          <th style={styles.th}>Business name</th>
          <th style={styles.th}>Address</th>
          <th style={styles.th}>Contact name</th>
          <th style={styles.th}>Contact number</th>
          <th style={styles.th}>Employee Count</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((item) => (
          <tr key={item.dunsLocId} style={styles.trHover}>
            <td style={styles.td}>
              <input
                type="radio"
                name="dunsSelect"
                value={item.dunsLocId}
                checked={selectedId === item.dunsLocId}
                onChange={() => onSelect(item.dunsLocId)}
                style={styles.radio}
              />
            </td>
            <td style={styles.td}>{item.dunsLocId}</td>
            <td style={styles.td}>{item.businessName || '-'}</td>
            <td style={styles.td}>
              {item.businessAddress?.addressLine1 || '-'}
            </td>
            <td style={styles.td}>{item.contactName || '-'}</td>
            <td style={styles.td}>{item.phoneNumber || '-'}</td>
            <td style={styles.td}>{item.employeeCount || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StyledTable;
