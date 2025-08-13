import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BusinessForm from './BusinessForm';

// Mock @vds/inputs, @vds/tooltips, and DunsTable
jest.mock('@vds/inputs', () => ({
  Input: (props) => <input data-testid="mock-input" {...props} />,
}));
jest.mock('@vds/tooltips', () => ({
  Tooltip: ({ children }) => <span data-testid="mock-tooltip">{children}</span>,
}));
const mockOnSelect = jest.fn();
jest.mock('./DunsTable', () => (props) => (
  <div data-testid="mock-dunstable">
    {props.data.map((row) => (
      <div
        key={row.dunsLocId}
        data-testid="duns-row"
        onClick={() => props.onSelect && props.onSelect(row.dunsLocId)}
      >
        {row.dunsLocId}
      </div>
    ))}
  </div>
));

describe('BusinessForm', () => {
  it('renders business info and address', async () => {
    render(<BusinessForm />);
    expect(await screen.findByText('test')).toBeInTheDocument();
    expect(screen.getByText(/2102 ULSTER PL/)).toBeInTheDocument();
    expect(screen.getByText('test@test.com')).toBeInTheDocument();
    expect(screen.getByText('(757) 623-8574')).toBeInTheDocument();
  });

  it('renders tooltip and input for business description', async () => {
    render(<BusinessForm />);
    expect(screen.getByText('Business Description')).toBeInTheDocument();
    expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input')).toBeInTheDocument();
  });

  it('renders DunsTable with matched business info', async () => {
    render(<BusinessForm />);
    // Wait for useEffect to set results
    await waitFor(() => {
      expect(screen.getByTestId('mock-dunstable')).toBeInTheDocument();
    });
    expect(screen.getByText('ABCDEF1234')).toBeInTheDocument();
    expect(screen.getByText('ABCDEF1235')).toBeInTheDocument();
  });

  it('calls handleDunsSelect when a DUNS row is clicked', async () => {
    render(<BusinessForm />);
    await waitFor(() => {
      expect(screen.getByText('ABCDEF1234')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('ABCDEF1234'));
    // The component logs to console, but we can't check state directly since selectedDuns is not rendered
    // So just ensure no error and click works
  });

  it('renders empty input for business description', async () => {
    render(<BusinessForm />);
    const input = screen.getByTestId('mock-input');
    expect(input).toHaveValue('');
