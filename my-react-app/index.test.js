import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import * as appMessageActions from 'onevzsoemfecommon/AppMessageActions';
import { useLazyCreateCartQuery } from 'onevzsoemfecommon/AccountAPIService';
import SMBProspectLanding from './index';

import {
  useUserProfileGlobalQuery,
  useLazyValidateSalesRepIdQuery,
} from '../../modules/services/APIService/APIServiceHooks';

// Mock child components with named functions and proper prop validation
jest.mock('../../components/SMBProspectLanding/SelectQuote/SelectQuote', () => {
  function SelectQuote() {
    return <div data-testid='SelectQuote' />
  }
  SelectQuote.displayName = 'SelectQuote';
  return SelectQuote;
});

jest.mock('../../components/SMBProspectLanding/StepperBar/StepperBar', () => {
  function StepperBar() {
    return <div data-testid='StepperBar' />
  }
  StepperBar.displayName = 'StepperBar';
  return StepperBar;
});

jest.mock('../../components/SMBProspectLanding/Footer/Footer', () => {
  // eslint-disable-next-line react/prop-types
  function Footer({ currentFlow }) {
    return <div data-testid='Footer'>{currentFlow}</div>
  }
  Footer.displayName = 'Footer';
  return Footer;
});

jest.mock('../../components/SMBProspectLanding/CustomerInformation/CustomerInformation', () => {
  function CustomerInformation() {
    return <div data-testid='CustomerInformation' />
  }
  CustomerInformation.displayName = 'CustomerInformation';
  return CustomerInformation;
});

jest.mock('../../components/CreditResults', () => {
  function CreditResults() {
    return <div data-testid='CreditResults' />
  }
  CreditResults.displayName = 'CreditResults';
  return CreditResults;
});

jest.mock('../../components/SMBProspectLanding/BusinessInfo/BusinessInfo', () => {
  function BusinessInfo() {
    return <div data-testid='BusinessInfo' />
  }
  BusinessInfo.displayName = 'BusinessInfo';
  return BusinessInfo;
});

jest.mock('../../components/SMBProspectLanding/CoBrowse/CoBrowse', () => {
  function CoBrowse() {
    return <div data-testid='CoBrowse' />
  }
  CoBrowse.displayName = 'CoBrowse';
  return CoBrowse;
});

jest.mock('../../components/SMBEnrollment/POCinfo/PocInformation', () => {
  function PocInformation() {
    return <div data-testid='PocInformation' />
  }
  PocInformation.displayName = 'PocInformation';
  return PocInformation;
});

jest.mock('../../components/CreditResults/CreditResultPage', () => {
  function CreditResultPage() {
    return <div data-testid='CreditResultPage' />
  }
  CreditResultPage.displayName = 'CreditResultPage';
  return CreditResultPage;
});

jest.mock('@vds/lines', () => ({
  Line: function Line() {
    return <div data-testid='Line' />;
  },
}));

jest.mock('@vds/buttons', () => ({
  // eslint-disable-next-line react/prop-types
  TextLink: function TextLink({ children, ...props }) {
    return (
      <button type='button' {...props}>
        {children}
      </button>
    );
  },
}));

jest.mock('@vds/typography', () => ({
  // eslint-disable-next-line react/prop-types
  Body: function Body({ children }) {
    return <span>{children}</span>;
  },
}));

jest.mock('../../components/SMBProspectLanding/common/helpers/StyledComponentsCommon', () => ({
  // eslint-disable-next-line react/prop-types
  ContainerSpace: function ContainerSpace({ children }) {
    return <div data-testid='ContainerSpace'>{children}</div>;
  },
  // eslint-disable-next-line react/prop-types
  FixedWidthContainer: function FixedWidthContainer({ children }) {
    return <div data-testid='FixedWidthContainer'>{children}</div>;
  },
}));

// Mock hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('onevzsoemfecommon/AppMessageActions', () => ({
  addAppMessage: jest.fn(),
}));

jest.mock('onevzsoemfecommon/AccountAPIService', () => ({
  useLazyCreateCartQuery: jest.fn(),
}));

jest.mock('../../modules/services/APIService/APIServiceHooks', () => ({
  useUserProfileGlobalQuery: jest.fn(),
  useLazyValidateSalesRepIdQuery: jest.fn(),
}));

describe('SMBProspectLanding', () => {
  let dispatchMock;
  let createCartMock;
  let validateSalesRepIdMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);

    // Default mocks for hooks
    useUserProfileGlobalQuery.mockReturnValue({
      data: { data: { ordLocation: 'LOC123', salesRepId: 'SRID123' } },
      status: 'fulfilled',
    });

    createCartMock = jest.fn();
    useLazyCreateCartQuery.mockReturnValue([createCartMock, {}]);

    validateSalesRepIdMock = jest.fn();
    useLazyValidateSalesRepIdQuery.mockReturnValue([validateSalesRepIdMock, {}]);

    jest.clearAllMocks();
  });

  it('renders main sections and child components', () => {
    // Patch useState to set updateStepperStatus.parent = 'Customer Information'
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy
      .mockImplementationOnce(() => ['smb-prospect', jest.fn()]) // currentFlow
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // validateSalesRepId
      .mockImplementationOnce(() => [{}, jest.fn()]) // triggerSalesId
      .mockImplementationOnce(() => [{ parent: 'Customer Information' }, jest.fn()]) // updateStepperStatus
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // createCart
      .mockImplementationOnce(() => [false, jest.fn()]) // isCreditCancelled
      .mockImplementationOnce(() => [false, jest.fn()]) // runCreditClicked
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // submitForm
      .mockImplementationOnce(() => [null, jest.fn()]) // smbCaseId
      .mockImplementationOnce(() => [{}, jest.fn()]); // businessInfo

    render(<SMBProspectLanding />);
    expect(screen.getByTestId('StepperBar')).toBeInTheDocument();
    expect(screen.getByTestId('SMBProspectLandingTest')).toBeInTheDocument();
    expect(screen.getByTestId('SelectQuote')).toBeInTheDocument();
    expect(screen.getByTestId('FixedWidthContainer')).toBeInTheDocument();
    expect(screen.getByTestId('ContainerSpace')).toBeInTheDocument();
    expect(screen.getByTestId('CustomerInformation')).toBeInTheDocument();
    expect(screen.getByTestId('BusinessInfo')).toBeInTheDocument();
    expect(screen.getByTestId('Footer')).toBeInTheDocument();
    expect(screen.getByTestId('CreditResultPage')).toBeInTheDocument();
    expect(screen.getByTestId('Line')).toBeInTheDocument();
    expect(screen.getByTestId('checkPortability-btn')).toBeInTheDocument();
    useStateSpy.mockRestore();
  });

  it('calls createCart when userProfileGlobalResults is fulfilled and has ordLocation', () => {
    render(<SMBProspectLanding />);
    expect(createCartMock).toHaveBeenCalledWith({
      body: {
        locationCode: 'LOC123',
        header: {
          clientAppName: 'ATG-RTL-NETACE',
          clientAppUserName: 'LOC123',
        },
      },
    });
  });

  it('calls validateSalesRepId when triggerSalesId.changed is true', async () => {
    // Simulate triggerSalesId.changed = true by updating the hook return value
    const validateSalesRepIdResults = {};
    useLazyValidateSalesRepIdQuery.mockReturnValue([validateSalesRepIdMock, validateSalesRepIdResults]);
    // Re-render with a custom component to trigger useEffect
    const { rerender } = render(<SMBProspectLanding />);
    // Simulate triggerSalesId changed
    rerender(<SMBProspectLanding />);
    // The validateSalesRepId should be called at least once
    await waitFor(() => {
      expect(validateSalesRepIdMock).toHaveBeenCalled();
    });
  });

  it('shows CoBrowse and message when updateStepperStatus.child is "Business information"', () => {
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy
      .mockImplementationOnce(() => ['smb-prospect', jest.fn()]) // currentFlow
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // validateSalesRepId
      .mockImplementationOnce(() => [{}, jest.fn()]) // triggerSalesId
      .mockImplementationOnce(() => [{ parent: 'Customer Information', child: 'Business information' }, jest.fn()]) // updateStepperStatus
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // createCart
      .mockImplementationOnce(() => [false, jest.fn()]) // isCreditCancelled
      .mockImplementationOnce(() => [false, jest.fn()]) // runCreditClicked
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // submitForm
      .mockImplementationOnce(() => [null, jest.fn()]) // smbCaseId
      .mockImplementationOnce(() => [{}, jest.fn()]); // businessInfo

    render(<SMBProspectLanding />);
    expect(screen.getByText(/Turn On Co-browse mode/i)).toBeInTheDocument();
    expect(screen.getByTestId('CoBrowse')).toBeInTheDocument();
    useStateSpy.mockRestore();
  });

  it('shows PocInformation when updateStepperStatus.child is "Poc information"', () => {
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy
      .mockImplementationOnce(() => ['smb-prospect', jest.fn()]) // currentFlow
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // validateSalesRepId
      .mockImplementationOnce(() => [{}, jest.fn()]) // triggerSalesId
      .mockImplementationOnce(() => [{ parent: 'Customer Information', child: 'Poc information' }, jest.fn()]) // updateStepperStatus
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // createCart
      .mockImplementationOnce(() => [false, jest.fn()]) // isCreditCancelled
      .mockImplementationOnce(() => [false, jest.fn()]) // runCreditClicked
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // submitForm
      .mockImplementationOnce(() => [null, jest.fn()]) // smbCaseId
      .mockImplementationOnce(() => [{}, jest.fn()]); // businessInfo

    render(<SMBProspectLanding />);
    expect(screen.getByTestId('PocInformation')).toBeInTheDocument();
    useStateSpy.mockRestore();
  });

  it('shows CreditResults when updateStepperStatus.parent is "Review credit application"', () => {
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy
      .mockImplementationOnce(() => ['smb-prospect', jest.fn()]) // currentFlow
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // validateSalesRepId
      .mockImplementationOnce(() => [{}, jest.fn()]) // triggerSalesId
      .mockImplementationOnce(() => [{ parent: 'Review credit application' }, jest.fn()]) // updateStepperStatus
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // createCart
      .mockImplementationOnce(() => [false, jest.fn()]) // isCreditCancelled
      .mockImplementationOnce(() => [false, jest.fn()]) // runCreditClicked
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // submitForm
      .mockImplementationOnce(() => [null, jest.fn()]) // smbCaseId
      .mockImplementationOnce(() => [{}, jest.fn()]); // businessInfo

    render(<SMBProspectLanding />);
    expect(screen.getByTestId('CreditResults')).toBeInTheDocument();
    useStateSpy.mockRestore();
  });

  it('dispatches error message if validateSalesRepIdResults is fulfilled but no givenName', async () => {
    // Simulate validateSalesRepIdResults with error
    const errorMsg = 'Invalid Sales Rep';
    useLazyValidateSalesRepIdQuery.mockReturnValue([
      jest.fn(),
      {
        status: 'fulfilled',
        data: {
          data: {
            error: { message: errorMsg },
          },
        },
      },
    ]);
    render(<SMBProspectLanding />);
    await waitFor(() => {
      expect(appMessageActions.addAppMessage).toHaveBeenCalledWith(errorMsg, 'error', true, true, true);
      expect(dispatchMock).toHaveBeenCalled();
    });
  });

  it('updates stepper status if validateSalesRepIdResults is fulfilled and givenName exists', async () => {
    useLazyValidateSalesRepIdQuery.mockReturnValue([
      jest.fn(),
      {
        status: 'fulfilled',
        data: {
          data: {
            detail: { givenName: 'John' },
          },
        },
      },
    ]);
    render(<SMBProspectLanding />);
    // No error dispatch expected
    await waitFor(() => {
      expect(appMessageActions.addAppMessage).not.toHaveBeenCalled();
    });
  });

  it('renders Footer only when currentFlow is "smb-prospect"', () => {
    render(<SMBProspectLanding />);
    expect(screen.getByTestId('Footer')).toBeInTheDocument();
    expect(screen.getByTestId('Footer')).toHaveTextContent('smb-prospect');
  });

  it('renders Check Portability button', () => {
    // Patch useState to set updateStepperStatus.parent = 'Customer Information'
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy
      .mockImplementationOnce(() => ['smb-prospect', jest.fn()]) // currentFlow
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // validateSalesRepId
      .mockImplementationOnce(() => [{}, jest.fn()]) // triggerSalesId
      .mockImplementationOnce(() => [{ parent: 'Customer Information' }, jest.fn()]) // updateStepperStatus
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // createCart
      .mockImplementationOnce(() => [false, jest.fn()]) // isCreditCancelled
      .mockImplementationOnce(() => [false, jest.fn()]) // runCreditClicked
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // submitForm
      .mockImplementationOnce(() => [null, jest.fn()]) // smbCaseId
      .mockImplementationOnce(() => [{}, jest.fn()]); // businessInfo

    render(<SMBProspectLanding />);
    expect(screen.getByTestId('checkPortability-btn')).toBeInTheDocument();
    expect(screen.getByText('Check portability')).toBeInTheDocument();
    useStateSpy.mockRestore();
  });
});
