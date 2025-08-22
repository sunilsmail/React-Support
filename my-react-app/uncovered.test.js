
const businessInfo = {
  businessName: 'Test Biz',
  businessAddress: {
    addressLine1: '123 Main',
    city: 'City',
    state: 'ST',
    zipCode: '12345',
    country: 'USA',
  },
  phoneNumber: '1234567890',
};

describe('DUNSTable uncovered lines', () => {
  it('closes tooltip when Cancel is clicked (line 112)', () => {
    render(<DUNSTable data={[]} businessInfo={businessInfo} />);
    fireEvent.click(screen.getByText('Generate new DUNs number'));
    expect(screen.getByText('Employee count')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Employee count')).not.toBeInTheDocument();
  });

  it('enables submit button and resets error on alternate DUN input change (line 172)', () => {
    render(<DUNSTable data={[]} businessInfo={businessInfo} />);
    fireEvent.click(screen.getByText('Generate new DUNs number'));
    const empInput = screen.getAllByTestId('mock-input')[1];
    fireEvent.change(empInput, { target: { value: '10' } });
    expect(empInput.value).toBe('10');
    // The Submit button should now be enabled
    expect(screen.getByText('Submit')).not.toBeDisabled();
  });

  it('renders table row with missing address (line 295)', () => {
    const data = [
      {
        dunsLocId: '111111111',
        businessName: 'No Address',
        contactName: 'No One',
        phoneNumber: '',
        employeeCount: 5,
        // businessAddress missing
      },
    ];
    render(<DUNSTable data={data} businessInfo={businessInfo} />);
    expect(screen.getByText('No Address')).toBeInTheDocument();
    // Address cell should be '-'
    expect(screen.getAllByText('-')[0]).toBeInTheDocument();
  });

  it('renders table row with missing employeeCount (line 301)', () => {
    const data = [
      {
        dunsLocId: '222222222',
        businessName: 'No EmpCount',
        contactName: 'Someone',
        phoneNumber: '123',
        businessAddress: { addressLine1: 'A', city: 'B', state: 'C' },
        // employeeCount missing
      },
    ];
    render(<DUNSTable data={data} businessInfo={businessInfo} />);
    expect(screen.getByText('No EmpCount')).toBeInTheDocument();
    // Employee Count cell should be '-'
    expect(screen.getAllByText('-').pop()).toBeInTheDocument();
  });
});
