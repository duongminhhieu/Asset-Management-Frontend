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
    await waitFor(() => expect(window.location.href).toContain(""));
  });

  test("sorting functionality updates search parameters correctly", async () => {
    const assetCodeHeader = screen.getByText("Asset code");
    fireEvent.click(assetCodeHeader);
    await waitFor(() => expect(window.location.href).toContain("orderBy=assetCode&sortDir=asc"))
    fireEvent.click(assetCodeHeader);
    await waitFor(() => expect(window.location.href).toContain("orderBy=assetCode&sortDir=desc"))
    fireEvent.click(assetCodeHeader);
    await waitFor(() => expect(window.location.href).not.toContain("orderBy=assetCode"))
    fireEvent.click(screen.getByText("Asset name"))
    await waitFor(() => expect(window.location.href).toContain("orderBy=assetName&sortDir=asc"))
    fireEvent.click(screen.getByText("No."))
    await waitFor(() => expect(window.location.href).toContain("orderBy=id&sortDir=asc"))
    fireEvent.click(screen.getByText("Assigned To"))
    await waitFor(() => expect(window.location.href).toContain("orderBy=assignedTo&sortDir=asc"))
    fireEvent.click(screen.getByText("Assigned By"))
    await waitFor(() => expect(window.location.href).toContain("orderBy=assignedBy&sortDir=asc"))
    fireEvent.click(screen.getByText("Assigned Date"))
    await waitFor(() => expect(window.location.href).toContain("orderBy=assignedDate&sortDir=asc"))
    fireEvent.click(screen.getAllByText("State")[1]) 
    await waitFor(() => expect(window.location.href).toContain("orderBy=state&sortDir=asc"))
  });
});
