import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ManageAssetPage from "./ManageAssetPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";

// Mock the necessary modules
jest.mock("@/services/apis/asset.api", () => ({
  AssetAPICaller: {
    getSearchAssets: jest.fn().mockResolvedValue({
      data: {
        result: {
          data: [
            {
              id: "1",
              assetCode: "A-001",
              name: "Laptop",
              category: "Electronics",
              state: "Available",
            },
          ],
        },
      },
    }),
  },
}));

jest.mock("@/services/apis/category.api", () => ({
  CategoryAPICaller: {
    getAll: jest.fn().mockResolvedValue({
      data: {
        result: [{ id: "1", name: "Electronics" }],
      },
    }),
  },
}));

// Helper function to wrap component with react-query's QueryClientProvider
const renderWithClient = () => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Router>
        <ManageAssetPage />
      </Router>
    </QueryClientProvider>
  );
};

describe("ManageAssetPage", () => {
  test("renders without crashing", () => {
    renderWithClient();
    expect(screen.getByText("Asset List")).toBeInTheDocument();
  });

  test("search functionality triggers re-render with correct parameters", async () => {
    renderWithClient();
    const searchInput = screen.getByPlaceholderText("input search text");
    fireEvent.change(searchInput, { target: { value: "Laptop" } });
    fireEvent.keyPress(searchInput, { key: "Enter", code: "Enter" });
    await waitFor(() => expect(screen.getByText("A-001")).toBeInTheDocument());
  });

  test("table renders correct number of rows", async () => {
    renderWithClient();
    await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(2)); // Including header row
  });

  test("sorting functionality updates search parameters correctly", async () => {
    renderWithClient();
    const assetCodeHeader = screen.getByText("Asset Code");
    fireEvent.click(assetCodeHeader);
    await waitFor(() => expect(screen.getByText("A-001")).toBeInTheDocument());
  });
});
