import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import ReportPage from "./ReportPage";

jest.mock("@/services/apis/report.api", () => ({
  ReportAPICaller: {
    getReport: jest.fn().mockResolvedValue({
      data: {
        result: {
          total: 3,
          page: 1,
          itemsPerPage: 10,
          data: [
            {
              categoryId: 1,
              categoryName: "LAPTOP",
              total: 6,
              assignedCount: 1,
              availableCount: 4,
              notAvailableCount: 1,
              waitingForRecycleCount: 0,
              recycledCount: 0,
            },
            {
              categoryId: 2,
              categoryName: "Windows",
              total: 3,
              assignedCount: 1,
              availableCount: 2,
              notAvailableCount: 0,
              waitingForRecycleCount: 0,
              recycledCount: 0,
            },
            {
              categoryId: 3,
              categoryName: "Quan Ao",
              total: 1,
              assignedCount: 0,
              availableCount: 1,
              notAvailableCount: 0,
              waitingForRecycleCount: 0,
              recycledCount: 0,
            },
          ],
        },
      },
    }),
  },
}));

describe("Report Page", () => {
  const client = new QueryClient();
  beforeEach(() => {
    render(
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
  });

  test("renders report title", () => {
    expect(screen.getByText("Report")).toBeInTheDocument();
  });

  test("renders table with data", async () => {
    await waitFor(() => {
      expect(screen.getByText("LAPTOP")).toBeInTheDocument();
      expect(screen.getByText("Windows")).toBeInTheDocument();
      expect(screen.getByText("Quan Ao")).toBeInTheDocument();
    });
  });

  test("sort functionality updates search parameters", async () => {
    const categoryHeader = screen.getByText("Category");
    fireEvent.click(categoryHeader);
    await waitFor(() =>
      expect(window.location.href).toContain("orderBy=categoryName&sortDir=asc")
    );
    fireEvent.click(categoryHeader);
    await waitFor(() =>
      expect(window.location.href).toContain(
        "orderBy=categoryName&sortDir=desc"
      )
    );
    fireEvent.click(categoryHeader);
    await waitFor(() =>
      expect(window.location.href).not.toContain("orderBy=categoryName")
    );
  });
});
