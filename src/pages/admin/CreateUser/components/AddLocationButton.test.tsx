import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddLocationButton from "./AddLocationButton";
import { LocationAPICaller } from "@/services/apis/location.api";
import { Location } from "@/types/Location";
import { QueryClient, QueryClientProvider } from "react-query";
import { message } from "antd";

const queryClient = new QueryClient();

jest.mock("@/services/apis/location.api", () => ({
  LocationAPICaller: {
    createLocation: jest.fn(),
  },
}));

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  message: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("AddLocationButton Component", () => {
  const mockRefetchLocations = jest.fn();
  const mockItems: Location[] = [];
  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddLocationButton
          items={mockItems} // Cung cấp mock items
          refetchLocations={mockRefetchLocations}
        />
      </QueryClientProvider>
    );
  });

  it('renders "Add new location" text initially', () => {
    expect(screen.getByText("Add new location")).toBeInTheDocument();
  });

  it('shows input fields and buttons when "Add new location" is clicked', () => {
    fireEvent.click(screen.getByText("Add new location"));

    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Code")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /check/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("enables the save button when both inputs are valid", () => {
    fireEvent.click(screen.getByText("Add new location"));

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test Location" },
    });
    fireEvent.change(screen.getByPlaceholderText("Code"), {
      target: { value: "TCT" },
    });

    expect(screen.getByRole("button", { name: /check/i })).toBeEnabled();
  });

  it("calls createLocation API on form submission and shows success message", async () => {
    (LocationAPICaller.createLocation as jest.Mock).mockResolvedValue({
      data: { result: { name: "New Location" } },
    });

    fireEvent.click(screen.getByText("Add new location"));

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test Location" },
    });
    fireEvent.change(screen.getByPlaceholderText("Code"), {
      target: { value: "TCT" },
    });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() => {
      expect(LocationAPICaller.createLocation).toHaveBeenCalledWith({
        name: "Test Location",
        code: "TCT",
      });
    });

    expect(mockRefetchLocations).toHaveBeenCalled();
    expect(message.success).toHaveBeenCalledWith("Location added successfully");
  });

  it("shows an error message if createLocation API fails", async () => {
    const errorMessage = "Error occurred";
    (LocationAPICaller.createLocation as jest.Mock).mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    fireEvent.click(screen.getByText("Add new location"));

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test Location" },
    });
    fireEvent.change(screen.getByPlaceholderText("Code"), {
      target: { value: "TCT" },
    });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('cancels input fields and buttons when "Cancel" button is clicked', () => {
    fireEvent.click(screen.getByText("Add new location"));

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test Location" },
    });
    fireEvent.change(screen.getByPlaceholderText("Code"), {
      target: { value: "TCT" },
    });

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(screen.queryByPlaceholderText("Name")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Code")).not.toBeInTheDocument();
  });
});
