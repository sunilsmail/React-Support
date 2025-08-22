import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DunsDetails from './DunsDetails';

// 🔹 Mock external components
jest.mock('@vds/inputs', () => ({
  Input: (props) => <input data-testid="mock-input" {...props} />
}));

jest.mock('@vds/tooltips', () => ({
  Tooltip: ({ title, children }) => (
    <div data-testid="mock-tooltip">
      {children}
      <span>{title}</span>
    </div>
  )
}));

jest.mock('./DunsTable', () => (props) => (
  <div data-testid="mock-dunstable">
    MockDunsTable - {props.data?.length || 0} rows
    <button onClick={() => props.onSelect('123456789')}>Select DUNS</button>
    <button onClick={() => props.setCreateDunsSuccess('success')}>Trigger Create</button>
  </div>
));

// 🔹 Mock API hook
const mockRetrieveDuns = jest.fn();
jest.mock('onevzsoemfecommon/SMBAPIService', () => ({
  useRetrieveDunsMutation: () => [mockRetrieveDuns]
}));

const mockBusinessInfo = {
  businessName: 'Test Business',
  businessAddress: {
    addressLine1: '123 Main St',
    addressLine2: 'Suite 100',
    city: 'TestCity',
    state: 'TS',
    zipCode: '12345',
    country: 'TestCountry'
  },
  businessEmail: 'test@test.com',
  phoneNumber: '1234567890'
};

describe('DunsDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders business info correctly', () => {
    render(<DunsDetails businessInfo={mockBusinessInfo} />);
    expect(screen.getByText('Test Business')).toBeInTheDocument();
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
    expect(screen.getByText(/test@test.com/)).toBeInTheDocument();
    expect(screen.getByText(/1234567890/)).toBeInTheDocument();
  });

  test('renders tooltip and styled input', () => {
    render(<DunsDetails businessInfo={mockBusinessInfo} />);
    expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input')).toBeInTheDocument();
  });

  test('calls retrieveDuns API and renders results', async () => {
    mockRetrieveDuns.mockResolvedValueOnce({
      data: { matchedBusinessInfoList: [{ dunsId: '111', name: 'BizOne' }] }
    });

    render(<DunsDetails businessInfo={mockBusinessInfo} />);

    await waitFor(() => {
      expect(mockRetrieveDuns).toHaveBeenCalled();
      expect(screen.getByTestId('mock-dunstable')).toHaveTextContent('1 rows');
    });
  });

  test('handles API error gracefully', async () => {
    const error = new Error('API failed');
    mockRetrieveDuns.mockRejectedValueOnce(error);

    render(<DunsDetails businessInfo={mockBusinessInfo} />);
    await waitFor(() => {
      expect(mockRetrieveDuns).toHaveBeenCalled();
    });
  });

  test('handles DUNS selection', async () => {
    mockRetrieveDuns.mockResolvedValueOnce({
      data: { matchedBusinessInfoList: [{ dunsId: '111' }] }
    });

    render(<DunsDetails businessInfo={mockBusinessInfo} />);

    const dunsTable = await screen.findByTestId('mock-dunstable');
    const selectBtn = screen.getByText('Select DUNS');

    fireEvent.click(selectBtn);
    expect(dunsTable).toHaveTextContent('MockDunsTable');
  });

  test('re-fetches data when createDunsSuccess is set', async () => {
    mockRetrieveDuns.mockResolvedValue({
      data: { matchedBusinessInfoList: [{ dunsId: '222' }] }
    });

    render(<DunsDetails businessInfo={mockBusinessInfo} />);
    const triggerBtn = await screen.findByText('Trigger Create');

    fireEvent.click(triggerBtn);

    await waitFor(() => {
      expect(mockRetrieveDuns).toHaveBeenCalledTimes(2);
    });
  });
});
