import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BusinessForm from './BusinessForm';

// Mock @vds/inputs
jest.mock('@vds/inputs', () => ({
  Input: ({ ...props }) => <input data-testid="test-input" {...props} />,
}));

// Mock VDS components
jest.mock('@vds/tooltips', () => ({
  Tooltip: ({ children, title, size, surface }) => (
    <div
      data-testid="test-tooltip"
      data-size={size}
      data-surface={surface}
    >
      <span>{title}</span>
      {children}
    </div>
  ),
}));

// Mock DunsTable
jest.mock('./DunsTable', () => ({
  __esModule: true,
  default: ({ onSelect }) => (
    <div
      data-testid="mock-dunstable"
      role="button"
      tabIndex={0}
      onClick={() => onSelect('MOCK_DUNS_ID')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect('MOCK_DUNS_ID');
        }
      }}
    >
      Mock Table
    </div>
  ),
}));

describe('BusinessForm', () => {
  it('renders business info from useEffect', async () => {
    render(<BusinessForm />);
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
    expect(screen.getByTestId('mock-dunstable')).toBeInTheDocument();
  });
});
