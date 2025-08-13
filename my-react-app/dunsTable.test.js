import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DUNSTable from './DUNSTable';

jest.mock('@vds/tooltips', () => ({
  Tooltip: ({ children, title }) => (
    <div data-testid="test-tooltip">
      <span>{title}</span>
      {children}
    </div>
  ),
}));

jest.mock('@vds/inputs', () => ({
  Input: ({ value, onChange, placeholder, ...props }) => (
    <input
      data-testid="mock-input"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      {...props}
    />
  ),
}));

const mockData = [
  {
    dunsLocId: '123456789',
    businessName: 'Test Business',
    contactName: 'John Doe',
    phoneNumber: '1234567890',
    employeeCount: 10,
    businessAddress: {
      addressLine1: '123 Street',
      city: 'City',
      state: 'ST',
      zip: '12345',
    },
  },
  {
    dunsLocId: '987654321',
    businessName: 'Another Business',
    contactName: 'Jane Smith',
    phoneNumber: '0987654321',
    employeeCount: 20,
    businessAddress: {
      addressLine1: '456 Avenue',
      city: 'Town',
      state: 'TS',
      zip: '54321',
    },
  },
];

describe('DUNSTable', () => {
  it('renders table rows correctly', () => {
    render(<DUNSTable data={mockData} />);
    expect(screen.getByText('Test Business')).toBeInTheDocument();
    expect(screen.getByText('Another Business')).toBeInTheDocument();
  });

  it('searches and filters table data', () => {
    render(<DUNSTable data={mockData} />);
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    expect(screen.queryByText('Another Business')).not.toBeInTheDocument();
  });

  it('resets search filter', () => {
    render(<DUNSTable data={mockData} />);
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    fireEvent.click(screen.getByText('Reset'));
    expect(searchInput.value).toBe('');
  });

  it('shows tooltip when generating new DUNs number', () => {
    render(<DUNSTable data={mockData} />);
    fireEvent.click(screen.getByText('Generate new DUNs number'));
    expect(screen.getByText('Employee count')).toBeInTheDocument();
  });

  it('shows error when submitting invalid employee count', () => {
    render(<DUNSTable data={mockData} />);
    fireEvent.click(screen.getByText('Generate new DUNs number'));
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('Please enter valid employee count')).toBeInTheDocument();
  });

  it('closes tooltip when Cancel is clicked', () => {
    render(<DUNSTable data={mockData} />);
    fireEvent.click(screen.getByText('Generate new DUNs number'));
    expect(screen.getByText('Employee count')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Employee count')).not.toBeInTheDocument();
  });

  it('submits alternate DUN successfully when count is valid', () => {
    render(<DUNSTable data={mockData} />);
    fireEvent.click(screen.getByText('Generate new DUNs number'));

    const altInput = screen.getAllByTestId('mock-input')[1];
    fireEvent.change(altInput, { target: { value: '5' } });
    fireEvent.click(screen.getByText('Submit'));

    expect(screen.queryByText('Employee count')).not.toBeInTheDocument();
  });

  it('selects a row when clicking on the row itself', () => {
    const onSelect = jest.fn();
    render(<DUNSTable data={mockData} onSelect={onSelect} />);
    const row = screen.getByText('123456789').closest('tr');
    fireEvent.click(row);
    expect(onSelect).toHaveBeenCalledWith('123456789');
  });

  it('renders "-" for missing data fields', () => {
    const incompleteData = [
      {
        dunsLocId: '000000001',
        businessName: '',
        contactName: undefined,
        phoneNumber: null,
        employeeCount: null,
        businessAddress: {},
      },
    ];
    render(<DUNSTable data={incompleteData} />);
    expect(screen.getAllByText('-').length).toBeGreaterThan(1);
  });
});
