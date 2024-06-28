import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AssignmentDetailsModal from "./AssignmentDetailsModal";
describe("Test Assignment Details Modal", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <AssignmentDetailsModal
          data={{
            id: 0,
            asset: {
              id: 3,
              name: "Printer",
              specification: "Sample Specification",
              assetCode: "LP000017",
              installDate: new Date("2024-06-27"),
              EAssetSate: "AVAILABLE",
              category: "Devices",
              state: "Available",
              location: {
                id: 1,
                name: "Ho Chi Minh",
              },
            },
            assignBy: "Duy",
            assignTo: "Nguyen",
            assignedDate: new Date("2024-06-27"),
            note: "None",
            returnDate: null,
            state: "WAITING",
          }}
          show={true}
        />
        <AssignmentDetailsModal
          data={{
            id: 0,
            asset: {
              id: 3,
              name: "Printer",
              specification: "Sample Specification",
              assetCode: "LP000017",
              installDate: new Date("2024-06-27"),
              EAssetSate: "AVAILABLE",
              category: "Devices",
              state: "Available",
              location: {
                id: 1,
                name: "Ho Chi Minh",
              },
            },
            assignBy: "Duy",
            assignTo: "Nguyen",
            assignedDate: new Date("2024-06-27"),
            note: "None",
            returnDate: null,
            state: "WAITING",
          }}
        />
      </BrowserRouter>
    );
  });

  test("Render", () => {
    expect(screen.getByTestId('assetCode')).toBeInTheDocument();
    expect(screen.getByTestId("assetName")).toBeInTheDocument();
    expect(screen.getByTestId("specification")).toBeInTheDocument();
    expect(screen.getByTestId("assignedBy")).toBeInTheDocument();
    expect(screen.getByTestId("assignedTo")).toBeInTheDocument();
    expect(screen.getByTestId("assignedDate")).toBeInTheDocument();
    expect(screen.getByTestId("state")).toBeInTheDocument();
    expect(screen.getByTestId("note")).toBeInTheDocument();
  });
});
