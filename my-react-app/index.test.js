import React from "react";
import { render, screen, act } from "@testing-library/react";
import { useDispatch } from "react-redux";
import * as appMessageActions from "onevzsoemfecommon/AppMessageActions";
import {
  useUserProfileGlobalQuery,
  useLazyCreateCartQuery,
  useLazyValidateSalesRepIdQuery,
} from "../../modules/services/APIService/APIServiceHooks";
import SMBProspectLanding from "../SMBProspectLanding";

// Mock redux
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

// Mock API hooks
const mockCreateCart = jest.fn();
const mockValidateSalesRep = jest.fn();

jest.mock("../../modules/services/APIService/APIServiceHooks", () => ({
  useUserProfileGlobalQuery: jest.fn(),
  useLazyCreateCartQuery: jest.fn(),
  useLazyValidateSalesRepIdQuery: jest.fn(),
}));

// Mock children
jest.mock("../../components/SMBProspectLanding/StepperBar/StepperBar", () => (props) => (
  <div data-testid="stepper">{JSON.stringify(props)}</div>
));
jest.mock("../../components/SMBProspectLanding/SelectQuote/SelectQuote", () => () => (
  <div data-testid="select-quote" />
));
jest.mock("../../components/SMBProspectLanding/CustomerInformation/CustomerInformation", () => () => (
  <div data-testid="customer-info" />
));
jest.mock("../../components/SMBProspectLanding/BusinessInfo/BusinessInfo", () => () => (
  <div data-testid="business-info" />
));
jest.mock("../../components/SMBProspectLanding/ContractSignerInfo/ContractSignerInformation", () => () => (
  <div data-testid="contract-signer" />
));
jest.mock("../../components/SMBProspectLanding/CoSign/CoSignInfo", () => () => (
  <div data-testid="co-sign-info" />
));
jest.mock("../../components/SMBProspectLanding/CoBrowse/CoBrowse", () => () => <div data-testid="co-browse" />);
jest.mock("../../components/SMBEnrollment/POCinfo/PocInformation", () => () => (
  <div data-testid="poc-info" />
));
jest.mock("../../components/SMBEnrollment/DunsDetails", () => () => <div data-testid="duns-details" />);
jest.mock("../../components/CreditResults", () => () => <div data-testid="credit-results" />);
jest.mock("../../components/CreditResults/CreditResultPage", () => () => (
  <div data-testid="credit-result-page" />
));
jest.mock("../../components/SMBProspectLanding/Footer/Footer", () => () => <div data-testid="footer" />);

describe("SMBProspectLanding", () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    useLazyCreateCartQuery.mockReturnValue([mockCreateCart, {}]);
    useLazyValidateSalesRepIdQuery.mockReturnValue([mockValidateSalesRep, {}]);
    jest.clearAllMocks();
  });

  it("always renders StepperBar and CreditResultPage", () => {
    useUserProfileGlobalQuery.mockReturnValue({ status: "idle", data: {} });

    render(<SMBProspectLanding />);
    expect(screen.getByTestId("stepper")).toBeInTheDocument();
    expect(screen.getByTestId("credit-result-page")).toBeInTheDocument();
  });

  it("calls createCart when profile has ordLocation and status is fulfilled", () => {
    useUserProfileGlobalQuery.mockReturnValue({
      status: "fulfilled",
      data: { data: { ordLocation: "LOC123" } },
    });

    render(<SMBProspectLanding />);
    expect(mockCreateCart).toHaveBeenCalledWith({
      body: {
        locationCode: "LOC123",
        header: {
          clientAppName: "ATG-RTL-NETACE",
          clientAppUserName: "LOC123",
        },
      },
    });
  });

  it("triggers sales rep validation when profile status is fulfilled", () => {
    mockValidateSalesRep.mockResolvedValue({});
    useUserProfileGlobalQuery.mockReturnValue({
      status: "fulfilled",
      data: { data: { salesRepId: "SR123" } },
    });

    render(<SMBProspectLanding />);
    expect(mockValidateSalesRep).toHaveBeenCalledWith(
      {
        body: { salesRepId: "SR123" },
        showErrorBanner: true,
      },
      false
    );
  });

  it("handles successful sales rep validation and updates stepper", () => {
    useUserProfileGlobalQuery.mockReturnValue({ status: "fulfilled", data: { data: {} } });
    useLazyValidateSalesRepIdQuery.mockReturnValue([
      mockValidateSalesRep,
      { status: "fulfilled", data: { data: { detail: { givenName: "John" } } } },
    ]);

    render(<SMBProspectLanding />);
    // Stepper should update to Customer Info
    expect(screen.getByTestId("stepper")).toHaveTextContent("Customer Information");
  });

  it("handles failed sales rep validation and dispatches error message", () => {
    useUserProfileGlobalQuery.mockReturnValue({ status: "fulfilled", data: { data: {} } });
    useLazyValidateSalesRepIdQuery.mockReturnValue([
      mockValidateSalesRep,
      { status: "fulfilled", data: { data: { error: { message: "Invalid rep" } } } },
    ]);

    render(<SMBProspectLanding />);
    expect(dispatchMock).toHaveBeenCalledWith(
      appMessageActions.addAppMessage("Invalid rep", "error", true, true, true)
    );
  });

  it("renders CustomerInformation and BusinessInfo when parent is Customer Information", () => {
    useUserProfileGlobalQuery.mockReturnValue({ status: "idle", data: {} });

    render(<SMBProspectLanding />);
    expect(screen.getByTestId("customer-info")).toBeInTheDocument();
    expect(screen.getByTestId("business-info")).toBeInTheDocument();
  });

  it("renders CoBrowse when child is Business information", () => {
    useUserProfileGlobalQuery.mockReturnValue({ status: "idle", data: {} });

    render(<SMBProspectLanding />);
    expect(screen.getByTestId("co-browse")).toBeInTheDocument();
  });

  it("renders DunsDetails when child is DUNs Selection", () => {
    useUserProfileGlobalQuery.mockReturnValue({ status: "idle", data: {} });

    render(<SMBProspectLanding />);
    expect(screen.getByTestId("duns-details")).toBeInTheDocument();
  });

  it("renders PocInformation when child is Poc information", () => {
    useUserProfileGlobalQuery.mockReturnValue({ status: "idle", data: {} });

    render(<SMBProspectLanding />);
    expect(screen.getByTestId("poc-info")).toBeInTheDocument();
  });

  it("renders CreditResults when parent is Review credit application", () => {
    useUserProfileGlobalQuery.mockReturnValue({ status: "idle", data: {} });

    render(<SMBProspectLanding />);
    expect(screen.getByTestId("credit-results")).toBeInTheDocument();
  });

  it("renders Footer when flow is smb-prospect", () => {
    useUserProfileGlobalQuery.mockReturnValue({ status: "idle", data: {} });

    render(<SMBProspectLanding />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
