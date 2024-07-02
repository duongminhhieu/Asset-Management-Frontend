import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import ManageReturningRequestPage from "./ManageReturningRequest";

jest.mock("@/services/apis/returning-request.api", () => ({
  ReturningRequestAPICaller: {
    getSearchReturningRequests: jest.fn().mockResolvedValue({
      data: {
        result: {
          data: [
            {
              id: 1,
              assignment: {
                asset: {
                  assetCode: "LP000001",
                  name: "Laptop Hp 1",
                },
              },
              requestedBy: { username: "testUser" },
              assignedDate: new Date(),
              acceptedBy: { username: "acceptUser" },
              returnDate: new Date(),
              state: "WAITING_FOR_RETURNING",
            },
          ],
          total: 1,
        },
      },
    }),
  },
}));

describe("ManageReturningRequestPage", () => {
  const client = new QueryClient();
  beforeEach(() => {
    render(
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <ManageReturningRequestPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
  });

  test("renders request list title", () => {
    expect(screen.getByText("Request List")).toBeInTheDocument();
  });

  test("renders table with data", async () => {
    await waitFor(() => {
      expect(screen.getByText("LP000001")).toBeInTheDocument();
      expect(screen.getByText("Laptop Hp 1")).toBeInTheDocument();
      expect(screen.getByText("testUser")).toBeInTheDocument();
    });
  });

  test("search functionality updates search parameters", async () => {
    const searchInput = screen.getByPlaceholderText("input search text");
    fireEvent.change(searchInput, { target: { value: "Laptop" } });
    fireEvent.keyPress(searchInput, { key: "Enter", code: "Enter" });
    await waitFor(() =>
      expect(screen.getByDisplayValue("Laptop")).toBeInTheDocument()
    );
  });

  test("sorting functionality updates search parameters", async () => {
    const assetCodeHeader = screen.getByText("Asset code");
    fireEvent.click(assetCodeHeader);
    await waitFor(() =>
      expect(window.location.href).toContain("orderBy=assetCode&sortDir=asc")
    );
    fireEvent.click(assetCodeHeader);
    await waitFor(() =>
      expect(window.location.href).toContain("orderBy=assetCode&sortDir=desc")
    );
    fireEvent.click(assetCodeHeader);
    await waitFor(() =>
      expect(window.location.href).not.toContain("orderBy=assetCode")
    );
  });
});
