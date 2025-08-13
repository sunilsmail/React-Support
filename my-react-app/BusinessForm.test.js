import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BusinessForm from './BusinessForm';

// Mock @vds/inputs and @vds/tooltips
jest.mock('@vds/inputs', () => ({
  Input: (props) => <input data-testid="mock-input" {...props} />,
}));
jest.mock('@vds/tooltips', () => ({
  Tooltip: ({ children }) => <span data-testid="mock-tooltip">{children}</span>,
}));

// Mock DunsTable as requested
jest.mock('./DunsTable', () => {
  function DunsTableMock(props) {
    return (
      <div data-testid="mock-dunstable">
        {JSON.stringify(props)}
      </div>
    );
  }
  return DunsTableMock;
});

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

  it('renders DunsTable with matched business info as props', async () => {
    render(<BusinessForm />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-dunstable')).toBeInTheDocument();
    });
    // Check that the matchedBusinessInfoList is passed as data prop
    const dunsTableProps = screen.getByTestId('mock-dunstable').textContent;
    expect(dunsTableProps).toContain('ABCDEF1234');
    expect(dunsTableProps).toContain('ABCDEF1235');
    expect(dunsTableProps).toContain('onSelect');
  });

  it('renders empty input for business description', async () => {
    render(<BusinessForm />);
    const input = screen.getByTestId('mock-input');
    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('maxLength', '9');
    expect(input).toHaveAttribute('placeholder', 'XXXXXXXXX');
  });
});
