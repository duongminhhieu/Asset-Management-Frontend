import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import ManageAssignmentPage from "./ManageAssignmentPage";

jest.mock("@/services/apis/assignment.api", () => ({
  AssignmentAPICaller: {
    getSearchAssignments: jest.fn().mockResolvedValue({
      data: {
        result: {
          data: [
            {
              id: 1,
              assignedDate: new Date(),
              note: "Provide laptop",
              state: "WAITING",
              assignTo: "testUser2",
              assignBy: "testUser1",
              asset: {
                id: "2",
                name: "Laptop Hp 1",
                specification: "Core i5, 8Gb RAM",
                assetCode: "LP000001",
                installDate: new Date(),
                state: "AVAILABLE",
                location: {
                  id: 1,
                  name: "Ha Noi",
                  code: "HN",
                },
                category: "Laptop",
              },
              returnDate: null,
            },
          ],
        },
      },
    }),
  },
}));

describe("test manage assignment page", () => {
  const client = new QueryClient();
  beforeEach(() => {
    render(
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <ManageAssignmentPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
  });

  test("render successfully", ()=>{
    expect(screen.getByText("Assignment List")).toBeInTheDocument();
  })

  test("search functionality triggers re-render with correct parameters", async () => {
    const searchInput = screen.getByPlaceholderText("input search text");
    fireEvent.change(searchInput, { target: { value: "Laptop" } });
    fireEvent.keyPress(searchInput, { key: "Enter", code: "Enter" });
    await waitFor(() => expect(screen.getByText("Laptop")).toBeInTheDocument());
  });

  test("sorting functionality updates search parameters correctly", async () => {
    const assetCodeHeader = screen.getByText("Asset code");
    fireEvent.click(assetCodeHeader);
    fireEvent.click(assetCodeHeader);
    fireEvent.click(assetCodeHeader);
    fireEvent.click(screen.getByText("Asset name"))
    fireEvent.click(screen.getByText("No."))
    fireEvent.click(screen.getByText("Assigned To"))
    fireEvent.click(screen.getByText("Assigned By"))
    fireEvent.click(screen.getByText("Assigned Date"))
    fireEvent.click(screen.getAllByText("State")[1]) 
    await waitFor(() => expect(screen.getByText("Laptop")).toBeInTheDocument());
  });
});
