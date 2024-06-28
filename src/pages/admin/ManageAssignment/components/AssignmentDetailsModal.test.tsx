import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AssignmenDetailsModal from "./AssignmentDetailsModal";
import { AssignmentResponse } from "@/types/AssignmentResponse";

// Mock the Modal component from antd
jest.mock("antd", () => {
  const originalModule = jest.requireActual("antd");

  return {
    __esModule: true,
    ...originalModule,
    Modal: jest.fn(({ children, ...props }) => (
      <div {...props}>{children}</div>
    )),
  };
});

describe("AssignmenDetailsModal", () => {
  const mockHandleClose = jest.fn();
  const mockData: AssignmentResponse = {
    asset: {
      assetCode: "AC123",
      name: "Laptop",
      specification: "Specs",
      id: 0,
      installDate: new Date("2021-01-01"),
      EAssetSate: "",
      category: "",
      location: {
        id: undefined,
        name: undefined,
        code: undefined,
      },
      state: "",
    },
    assignTo: "John Doe",
    assignBy: "Jane Doe",
    assignedDate: new Date("2021-01-01"),
    state: "Assigned",
    note: "Urgent",
    id: 0,
    returnDate: null,
  };

  test("does not render when show is false", () => {
    render(
      <AssignmenDetailsModal
        data={mockData}
        show={false}
        handleClose={mockHandleClose}
      />
    );
    expect(
      screen.queryByText("Detailed Assignment Infomation")
    ).not.toBeInTheDocument();
  });

  test("renders when show is true", () => {
    render(
      <AssignmenDetailsModal
        data={mockData}
        show
        handleClose={mockHandleClose}
      />
    );
    expect(screen.getByText("AC123")).toBeInTheDocument();
  });

  test("displays the correct data", () => {
    render(
      <AssignmenDetailsModal
        data={mockData}
        show
        handleClose={mockHandleClose}
      />
    );
    expect(screen.getByText("AC123")).toBeInTheDocument();
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Specs")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("01/01/2021")).toBeInTheDocument();
    expect(screen.getByText("Assigned")).toBeInTheDocument();
    expect(screen.getByText("Urgent")).toBeInTheDocument();
  });
});
