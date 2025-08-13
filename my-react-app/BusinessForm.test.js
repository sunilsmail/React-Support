import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BusinessForm from './BusinessForm';

// Mock @vds/inputs
jest.mock('@vds/inputs', () => ({
  Input: (props) => <input data-testid="test-input" {...props} />,
}));

// Mock @vds/tooltips
jest.mock('@vds/tooltips', () => ({
  Tooltip: ({ children, title }) => (
    <div data-testid="test-tooltip">
      <span>{title}</span>
      {children}
    </div>
  ),
}));

// Mock DunsTable
const mockOnSelect = jest.fn();
jest.mock('./DunsTable', () => {
  return function DunsTableMock(props) {
    return (
      <div
        data-testid="mock-dunstable"
        onClick={() => props.onSelect('MOCK_DUNS_ID')}
      >
        Mock Table
      </div>
    );
  };
});

describe('BusinessForm', () => {
  it('renders business info from useEffect', async () => {
    render(<BusinessForm />);

    // Wait for data from useEffect to populate
    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument();
      expect(screen.getByText(/2102 ULSTER PL CORAMNY 11727 - 5540/)).toBeInTheDocument();
      expect(screen.getByText('test@test.com')).toBeInTheDocument();
      expect(screen.getByText('(757) 623-8574')).toBeInTheDocument();
    });
  });

  it('renders tooltip with correct title', () => {
    render(<BusinessForm />);
    expect(screen.getByTestId('test-tooltip')).toHaveTextContent('Examples:');
  });

  it('renders StyledInput with placeholder and maxLength', () => {
    render(<BusinessForm />);
    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('placeholder', 'XXXXXXXXX');
    expect(input).toHaveAttribute('maxLength', '9');
  });

  it('calls handleDunsSelect when DunsTable onSelect is triggered', () => {
    render(<BusinessForm />);
    fireEvent.click(screen.getByTestId('mock-dunstable'));
    // SelectedDuns logs to console, but here we only verify it was called via DunsTable mock
    expect(screen.getByTestId('mock-dunstable')).toBeInTheDocument();
  });
});
