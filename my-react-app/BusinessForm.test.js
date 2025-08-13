import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BusinessForm from './BusinessForm';

// Mock @vds/inputs and @vds/tooltips
jest.mock('@vds/inputs', () => ({
  Input: (props) => <input data-testid="mock-input" {...props} />,
}));
jest.mock('@vds/tooltips', () => ({
  Tooltip: ( children ) => <span data-testid="mock-tooltip">{children}</span>,
}));

// Mock DunsTable as requested
jest.mock('./DunsTable', () => {
  function DunsTableMock(props) {
    return (
      <div data-testid="mock-dunstable"></div>
    );
  }
  DunsTableMock.propTypes = {
    data: () => {},
    onSelect: () => {},
  };
  return DunsTableMock;
});

describe('BusinessForm', () => {
  it('renders mock DunsTable', async () => {
    render(<BusinessForm />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-dunstable')).toBeInTheDocument();
    });
  });

  it('renders mock tooltip', () => {
    render(<BusinessForm />);
    expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
  });

  it('renders mock input', () => {
    render(<BusinessForm />);
    expect(screen.getByTestId('mock
