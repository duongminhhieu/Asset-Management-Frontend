import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import LocationSelector from "./LocationSelector";
import { LocationAPICaller } from "@/services/apis/location.api";
import TypeSelector from "./TypeSelector";
import { BrowserRouter } from "react-router-dom";

jest.mock("@/services/apis/location.api", () => ({
  LocationAPICaller: {
    getAllLocations: jest.fn(),
  },
}));

describe("LocationSelector Component", () => {
  const queryClient = new QueryClient();
  const mockOnChange = jest.fn();
  beforeEach(() => {
    // Mock data for successful fetch
    const mockLocations = [
      { id: 1, name: "Ha Noi", code: "TLA" },
      { id: 2, name: "Location B", code: "TLB" },
    ];
    (LocationAPICaller.getAllLocations as jest.Mock).mockResolvedValue({
      data: { result: mockLocations },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TypeSelector value="ADMIN" onChange={mockOnChange} />
          <LocationSelector value={undefined} onChange={mockOnChange} />
        </BrowserRouter>
      </QueryClientProvider>
    );
  });

  test("call callback function onChange when choose location", async () => {
    const selectElement = screen.getAllByRole("combobox")[0];

    fireEvent.mouseDown(selectElement);
    const adminOption = screen.getAllByText("Admin")[1];
    fireEvent.click(adminOption);
  });
});
