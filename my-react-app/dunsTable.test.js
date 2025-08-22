import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DUNSTable from './DunsTable';

// Mock VDS components
jest.mock('@vds/tables', () => ({
  Table: ({ children }) => <table data-testid="mock-table">{children}</table>,
  TableHead: ({ children }) => <thead>{children}</thead>,
  TableHeader: ({ children }) => <th>{children}</th>,
  TableBody: ({ children }) => <tbody>{children}</tbody>,
  TableRow: ({ children, ...props }) => <tr {...props}>{children}</tr>,
  Cell: ({ children, ...props }) => <td {...props}>{children}</td>,
}));

jest.mock('@vds/inputs', () => {
  function MockInput(props) {
    return (
      <input
        data-testid="mock-input"
        {...props}
        onChange={(e) => props.onChange && props.onChange(e)}
      />
    );
  }
  return { Input: MockInput };
});
jest.mock('@vds/buttons', () => ({
  Button: ({ children, ...props }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}));

// Mock API hook
const mockCreateDuns = jest.fn();
jest.mock('onevzsoemfecommon/SMBAPIService', () => ({
  useCreateDunsMutation: () => [mockCreateDuns],
}));

const sampleData = [
  {
    dunsLocId: '123456789',
    businessName: 'BizOne',
    businessAddress: { addressLine1: '123 St', city: 'City', state: 'ST' },
    contactName: 'John Doe',
    phoneNumber: '1234567890',
    employeeCount: 10,
  },
  {
    dunsLocId: '987654321',
    businessName: 'BizTwo',
    businessAddress: { addressLine1: '456 Ave', city: 'Town', state: 'TS' },
    contactName: 'Jane Smith',
    phoneNumber: '0987654321',
    employeeCount: 25,
  },
];

const mockBusinessInfo = {
  businessName: 'Test Business',
  businessAddress: {
    addressLine1: '123 Main St',
    city: 'CityX',
    state: 'ST',
    zipCode: '11111',
    country: 'USA',
  },
  phoneNumber: '1234567890',
};

describe('DUNSTable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with no data', () => {
    render(<DUNSTable data={[]} businessInfo={mockBusinessInfo} />);
    expect(screen.getByText('No records found')).toBeInTheDocument();
  });

  test('renders rows with data', () => {
    render(<DUNSTable data={sampleData} businessInfo={mockBusinessInfo} />);
    expect(screen.getByText('BizOne')).toBeInTheDocument();
    expect(screen.getByText('BizTwo')).toBeInTheDocument();
  });

  test('filters rows based on search input', () => {
    render(<DUNSTable data={sampleData} businessInfo={mockBusinessInfo} />);
    const input = screen.getAllByTestId('mock-input')[0];
    fireEvent.change(input, { target: { value: '987' } });
    expect(screen.getByText('BizTwo')).toBeInTheDocument();
    expect(screen.queryByText('BizOne')).not.toBeInTheDocument();
  });

  test('reset clears search and selection', () => {
    render(<DUNSTable data={sampleData} businessInfo={mockBusinessInfo} />);
    const input = screen.getAllByTestId('mock-input')[0];
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(screen.getByText('Reset all'));
    expect(input.value).toBe('');
    expect(screen.getByText('BizOne')).toBeInTheDocument();
    expect(screen.getByText('BizTwo')).toBeInTheDocument();
  });

  test('selects a row when clicked', () => {
    const mockOnSelect = jest.fn();
    render(
      <DUNSTable
        data={sampleData}
        businessInfo={mockBusinessInfo}
        onSelect={mockOnSelect}
      />
    );
    fireEvent.click(screen.getByText('BizOne'));
    expect(mockOnSelect).toHaveBeenCalledWith('123456789');
  });

  test('radio button selection works', () => {
    render(<DUNSTable data={sampleData} businessInfo={mockBusinessInfo} />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]);
    expect(radios[1]).toBeChecked();
  });

  test('shows tooltip when Generate new DUNs number is clicked', () => {
    render(<DUNSTable data={sampleData} businessInfo={mockBusinessInfo} />);
    fireEvent.click(screen.getByText('Generate new DUNs number'));
    expect(
      screen.getByText('Enter the number of Employees of the business')
    ).toBeInTheDocument();
    expect(screen.getByText('Employee count')).toBeInTheDocument();
  });

  test('cancel button closes tooltip', () => {
    render(<DUNSTable data={sampleData} businessInfo={mockBusinessInfo} />);
    fireEvent.click(screen.getByText('Generate new DUNs number'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(
      screen.queryByText('Enter the number of Employees of the business')
    ).not.toBeInTheDocument();
  });

  test('validates alternate DUN input (invalid: 0)', () => {
    render(<DUNSTable data={sampleData} businessInfo={mockBusinessInfo} />);
    fireEvent.click(screen.getByText('Generate new DUNs number'));
    fireEvent.change(screen.getAllByTestId('mock-input')[1], {
      target: { value: '0' },
    });
    fireEvent.click(screen.getByText('Submit'));
    expect(
      screen.getByText('Please enter an employee count greater than 1.')
    ).toBeInTheDocument();
  });

  test('validates alternate DUN input (invalid: NaN)', () => {
    render(<DUNSTable data={sampleData} businessInfo={mockBusinessInfo} />);
    fireEvent.click(screen.getByText('Generate new DUNs number'));
    fireEvent.change(screen.getAllByTestId('mock-input')[1], {
      target: { value: 'abc' },
    });
    fireEvent.click(screen.getByText('Submit'));
    expect(
      screen.getByText('Please enter an employee count greater than 1.')
    ).toBeInTheDocument();
  });

  test('submits valid employee count and calls API (success)', async () => {
    mockCreateDuns.mockResolvedValueOnce({});
    const mockSetSuccess = jest.fn();

    render(
      <DUNSTable
        data={sampleData}
        businessInfo={mockBusinessInfo}
        setCreateDunsSuccess={mockSetSuccess}
      />
    );

    fireEvent.click(screen.getByText('Generate new DUNs number'));
    const empInput = screen.getAllByTestId('mock-input')[1];
    fireEvent.change(empInput, { target: { value: '50' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockCreateDuns).toHaveBeenCalledTimes(1);
      expect(mockSetSuccess).toHaveBeenCalledTimes(1);
    });
  });

  test('handles API error on employee count submit', async () => {
    mockCreateDuns.mockRejectedValueOnce(new Error('API failed'));
    const mockSetSuccess = jest.fn();

    render(
      <DUNSTable
        data={sampleData}
        businessInfo={mockBusinessInfo}
        setCreateDunsSuccess={mockSetSuccess}
      />
    );

    fireEvent.click(screen.getByText('Generate new DUNs number'));
    const empInput = screen.getAllByTestId('mock-input')[1];
    fireEvent.change(empInput, { target: { value: '10' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockCreateDuns).toHaveBeenCalled();
    });
  });

  test('handles missing props gracefully', () => {
    render(<DUNSTable data={[]} />);
    expect(screen.getByText('No records found')).toBeInTheDocument();
  });
});
