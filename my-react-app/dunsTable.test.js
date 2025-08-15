/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DUNSTable from './DunsTable';

// Mock @vds/buttons and @vds/inputs
jest.mock('@vds/buttons', () => ({
  Button: ({ children, ...props }) => (
    <button type='button' data-testid='mock-button' {...props}>
      {children}
    </button>
  ),
}));
jest.mock('@vds/inputs', () => ({
  Input: ({ ...props }) => <input data-testid='mock-input' {...props} />,
}));
jest.mock('@vds/tables', () => ({
  Table: ({ children, ...props }) => <table {...props}>{children}</table>,
  TableHead: ({ children }) => <thead>{children}</thead>,
  TableHeader: ({ children }) => <th>{children}</th>,
  TableBody: ({ children }) => <tbody>{children}</tbody>,
  TableRow: ({ children, ...props }) => <tr {...props}>{children}</tr>,
  Cell: ({ children, ...props }) => <td {...props}>{children}</td>,
}));

const mockData = [
  {
    dunsLocId: '123456789',
    businessName: 'Acme Corp',
    contactName: 'John Doe',
    phoneNumber: '555-1234',
    employeeCount: 25,
    businessAddress: {
      addressLine1: '123 Main St',
      city: 'Metropolis',
      state: 'NY',
    },
  },
  {
    dunsLocId: '987654321',
    businessName: 'Beta LLC',
    contactName: 'Jane Smith',
    phoneNumber: '555-5678',
    employeeCount: 10,
    businessAddress: {
      addressLine1: '456 Elm St',
      city: 'Gotham',
      state: 'NJ',
    },
  },
];

describe('DUNSTable', () => {
  it('renders table headers and rows', () => {
    render(<DUNSTable data={mockData} />);
    expect(screen.getByText('DUNS ID')).toBeInTheDocument();
    expect(screen.getByText('Business Name')).toBeInTheDocument();
    expect(screen.getByText('Contact Name')).toBeInTheDocument();
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Employee Count')).toBeInTheDocument();

    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();

    expect(screen.getByText('987654321')).toBeInTheDocument();
    expect(screen.getByText('Beta LLC')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('555-5678')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('filters rows based on search input', () => {
    render(<DUNSTable data={mockData} />);
    const input = screen.getByTestId('mock-input');
    fireEvent.change(input, { target: { value: '987' } });
    expect(screen.getByText('987654321')).toBeInTheDocument();
    expect(screen.queryByText('123456789')).not.toBeInTheDocument();
  });

  it('shows validation message for invalid DUNS search', () => {
    render(<DUNSTable data={mockData} />);
    const input = screen.getByTestId('mock-input');
    fireEvent.change(input, { target: { value: '12' } });
    expect(screen.getByText('Please enter a valid 9 digit DUNS ID')).toBeInTheDocument();
  });

  it('calls onSelect when a row is selected', () => {
    const onSelect = jest.fn();
    render(<DUNSTable data={mockData} onSelect={onSelect} />);
    const radio = screen.getAllByRole('radio')[1]; // select second row
    fireEvent.click(radio);
    expect(onSelect).toHaveBeenCalledWith('987654321');
  });

  it('resets search and selection when Reset all is clicked', () => {
    render(<DUNSTable data={mockData} />);
    const input = screen.getByTestId('mock-input');
    fireEvent.change(input, { target: { value: '987' } });
    expect(screen.getByText('987654321')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Reset all'));
    expect(input.value).toBe('');
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('987654321')).toBeInTheDocument();
  });

  it('shows tooltip and handles alternate DUN submit/cancel', async () => {
    render(<DUNSTable data={mockData} />);
    fireEvent.click(screen.getByText('Generate new DUNs number'));
    expect(screen.getByText('Employee count')).toBeInTheDocument();

    const altInput = screen.getAllByTestId('mock-input')[1];
    fireEvent.change(altInput, { target: { value: '0' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('Please enter an employee count greater than 1.')).toBeInTheDocument();
  });

  it('shows "No records found" when filtered data is empty', () => {
    render(<DUNSTable data={mockData} />);
    const input = screen.getByTestId('mock-input');
    fireEvent.change(input, { target: { value: 'notfound' } });
    expect(screen.getByText('No records found')).toBeInTheDocument();
  });
  
  it('closes tooltip when Cancel is clicked', () => {
  render(<DUNSTable data={mockData} />);
  fireEvent.click(screen.getByText('Generate new DUNs number'));
  expect(screen.getByText('Employee count')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Cancel'));
  expect(screen.queryByText('Employee count')).not.toBeInTheDocument();
});

it('submits valid employee count and disables button', () => {
  render(<DUNSTable data={mockData} />);
  fireEvent.click(screen.getByText('Generate new DUNs number'));
  const altInput = screen.getAllByTestId('mock-input')[1];
  fireEvent.change(altInput, { target: { value: '5' } });
  expect(screen.getByText('Submit')).not.toBeDisabled();
  fireEvent.click(screen.getByText('Submit'));
  // After submit, button should be disabled again
  expect(screen.getByText('Submit')).toBeDisabled();
});

it('selects row when clicking anywhere on row', () => {
  const onSelect = jest.fn();
  render(<DUNSTable data={mockData} onSelect={onSelect} />);
  const row = screen.getByText('Acme Corp').closest('tr');
  fireEvent.click(row);
  expect(onSelect).toHaveBeenCalledWith('123456789');
});

it('renders dash when businessAddress is missing', () => {
  const incompleteData = [{
    dunsLocId: '111111111',
    businessName: '',
    contactName: '',
    phoneNumber: '',
    employeeCount: null,
    businessAddress: null
  }];
  render(<DUNSTable data={incompleteData} />);
  expect(screen.getByText('-')).toBeInTheDocument(); // For address
  expect(screen.getAllByText('-').length).toBeGreaterThan(1); // Multiple dashes
});

});
