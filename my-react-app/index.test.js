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

// ===== Mock children =====
jest.mock('../../components/SMBProspectLanding/SelectQuote/SelectQuote', () => () => <div data-testid="SelectQuote" />);
jest.mock('../../components/SMBProspectLanding/StepperBar/StepperBar', () => () => <div data-testid="StepperBar" />);
jest.mock('../../components/SMBProspectLanding/Footer/Footer', () => ({ currentFlow }) => <div data-testid="Footer">{currentFlow}</div>);
jest.mock('../../components/SMBProspectLanding/CustomerInformation/CustomerInformation', () => () => <div data-testid="CustomerInformation" />);
jest.mock('../../components/CreditResults', () => () => <div data-testid="CreditResults" />);
jest.mock('../../components/SMBProspectLanding/BusinessInfo/BusinessInfo', () => () => <div data-testid="BusinessInfo" />);
jest.mock('../../components/SMBProspectLanding/CoBrowse/CoBrowse', () => () => <div data-testid="CoBrowse" />);
jest.mock('../../components/SMBEnrollment/POCinfo/PocInformation', () => () => <div data-testid="PocInformation" />);
jest.mock('../../components/CreditResults/CreditResultPage', () => () => <div data-testid="CreditResultPage" />);
jest.mock('../../components/SMBProspectLanding/ContractSignerInfo/ContractSignerInformation', () => () => <div data-testid="ContractSignerInformation" />);
jest.mock('../../components/SMBProspectLanding/CoSign/CoSignInfo', () => () => <div data-testid="CoSignInfo" />);

jest.mock('@vds/lines', () => ({ Line: () => <div data-testid="Line" /> }));
jest.mock('@vds/buttons', () => ({ TextLink: ({ children, ...props }) => <button data-testid={props['data-testid']} {...props}>{children}</button> }));
jest.mock('@vds/typography', () => ({ Body: ({ children }) => <span>{children}</span> }));
jest.mock('../../components/SMBProspectLanding/common/helpers/StyledComponentsCommon', () => ({
  ContainerSpace: ({ children }) => <div data-testid="ContainerSpace">{children}</div>,
  FixedWidthContainer: ({ children }) => <div data-testid="FixedWidthContainer">{children}</div>,
}));

// ===== Mock hooks =====
jest.mock('react-redux', () => ({ useDispatch: jest.fn() }));
jest.mock('onevzsoemfecommon/AppMessageActions', () => ({ addAppMessage: jest.fn() }));
jest.mock('onevzsoemfecommon/AccountAPIService', () => ({ useLazyCreateCartQuery: jest.fn() }));
jest.mock('../../modules/services/APIService/APIServiceHooks', () => ({
  useUserProfileGlobalQuery: jest.fn(),
  useLazyValidateSalesRepIdQuery: jest.fn(),
}));

describe('SMBProspectLanding', () => {
  let dispatchMock;
  let createCartMock;
  let validateSalesRepIdMock;

  beforeEach(() => {
    jest.clearAllMocks();

    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);

    // default mock API
    useUserProfileGlobalQuery.mockReturnValue({
      data: { data: { ordLocation: 'LOC123', salesRepId: 'SRID123' } },
      status: 'fulfilled',
    });

    createCartMock = jest.fn();
    useLazyCreateCartQuery.mockReturnValue([createCartMock, {}]);

    validateSalesRepIdMock = jest.fn();
    useLazyValidateSalesRepIdQuery.mockReturnValue([validateSalesRepIdMock, {}]);
  });

  it('always renders StepperBar, Footer, and CreditResultPage', () => {
    render(<SMBProspectLanding />);
    expect(screen.getByTestId('StepperBar')).toBeInTheDocument();
    expect(screen.getByTestId('Footer')).toHaveTextContent('smb-prospect');
    expect(screen.getByTestId('CreditResultPage')).toBeInTheDocument();
  });

  it('renders SMBProspectMain content when parent is Customer Information', () => {
    // mock useState to force updateStepperStatus.parent
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => ['smb-prospect', jest.fn()]) // currentFlow
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // validateSalesRepId
      .mockImplementationOnce(() => [{}, jest.fn()]) // triggerSalesId
      .mockImplementationOnce(() => [{ parent: 'Customer Information' }, jest.fn()]) // updateStepperStatus
      .mockImplementationOnce(() => [jest.fn(), jest.fn()]) // createCart
      .mockImplementationOnce(() => [false, jest.fn()]) // isCreditCancelled
      .mockImplementationOnce(() => [false, jest.fn()]); // runCreditClicked

    render(<SMBProspectLanding />);

    expect(screen.getByTestId('SMBProspectLandingTest')).toBeInTheDocument();
    expect(screen.getByTestId('SelectQuote')).toBeInTheDocument();
    expect(screen.getByTestId('CustomerInformation')).toBeInTheDocument();
    expect(screen.getByTestId('BusinessInfo')).toBeInTheDocument();
    expect(screen.getByTestId('Line')).toBeInTheDocument();
    expect(screen.getByTestId('checkPortability-btn')).toBeInTheDocument();

    React.useState.mockRestore();
  });

  it('calls createCart when userProfileGlobalResults is fulfilled and has ordLocation', () => {
    render(<SMBProspectLanding />);
    expect(createCartMock).toHaveBeenCalledWith({
      body: {
        locationCode: 'LOC123',
        header: { clientAppName: 'ATG-RTL-NETACE', clientAppUserName: 'LOC123' },
      },
    });
  });

  it('dispatches error if validateSalesRepId fulfilled but no givenName', async () => {
    const errorMsg = 'Invalid Sales Rep';
    useLazyValidateSalesRepIdQuery.mockReturnValue([
      jest.fn(),
      { status: 'fulfilled', data: { data: { error: { message: errorMsg } } } },
    ]);

    render(<SMBProspectLanding />);
    await waitFor(() => {
      expect(appMessageActions.addAppMessage).toHaveBeenCalledWith(errorMsg, 'error', true, true, true);
      expect(dispatchMock).toHaveBeenCalled();
    });
  });

  it('does not dispatch error if validateSalesRepId fulfilled with givenName', async () => {
    useLazyValidateSalesRepIdQuery.mockReturnValue([
      jest.fn(),
      { status: 'fulfilled', data: { data: { detail: { givenName: 'John' } } } },
    ]);

    render(<SMBProspectLanding />);
    await waitFor(() => {
      expect(appMessageActions.addAppMessage).not.toHaveBeenCalled();
    });
  });

  it('renders CoBrowse when child step is Business information', () => {
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => ['smb-prospect', jest.fn()])
      .mockImplementationOnce(() => [jest.fn(), jest.fn()])
      .mockImplementationOnce(() => [{}, jest.fn()])
      .mockImplementationOnce(() => [{ parent: 'Customer Information', child: 'Business information' }, jest.fn()])
      .mockImplementationOnce(() => [jest.fn(), jest.fn()])
      .mockImplementationOnce(() => [false, jest.fn()])
      .mockImplementationOnce(() => [false, jest.fn()]);

    render(<SMBProspectLanding />);
    expect(screen.getByTestId('CoBrowse')).toBeInTheDocument();

    React.useState.mockRestore();
  });

  it('renders PocInformation when child step is Poc information', () => {
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => ['smb-prospect', jest.fn()])
      .mockImplementationOnce(() => [jest.fn(), jest.fn()])
      .mockImplementationOnce(() => [{}, jest.fn()])
      .mockImplementationOnce(() => [{ parent: 'Customer Information', child: 'Poc information' }, jest.fn()])
      .mockImplementationOnce(() => [jest.fn(), jest.fn()])
      .mockImplementationOnce(() => [false, jest.fn()])
      .mockImplementationOnce(() => [false, jest.fn()]);

    render(<SMBProspectLanding />);
    expect(screen.getByTestId('PocInformation')).toBeInTheDocument();

    React.useState.mockRestore();
  });

  it('renders CreditResults when parent is Review credit application', () => {
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => ['smb-prospect', jest.fn()])
      .mockImplementationOnce(() => [jest.fn(), jest.fn()])
      .mockImplementationOnce(() => [{}, jest.fn()])
      .mockImplementationOnce(() => [{ parent: 'Review credit application' }, jest.fn()])
      .mockImplementationOnce(() => [jest.fn(), jest.fn()])
      .mockImplementationOnce(() => [false, jest.fn()])
      .mockImplementationOnce(() => [false, jest.fn()]);

    render(<SMBProspectLanding />);
    expect(screen.getByTestId('CreditResults')).toBeInTheDocument();

    React.useState.mockRestore();
  });
});
