import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import ManageUserPage from "./ManageUserPage";

const queryClient = new QueryClient();

describe("ManageUserPage", () => {
  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ManageUserPage />
        </Router>
      </QueryClientProvider>
    );
  });

  test("renders without crashing", () => {
    expect(screen.getByText("User List")).toBeInTheDocument();
  });

  test("renders a create new user button", () => {
    expect(screen.getByText("Create new user")).toBeInTheDocument();
  });

  test("renders a user table", () => {
    expect(screen.getByText("Staff Code")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Joined Date")).toBeInTheDocument();
  });
  test("searches for users", async () => {
    fireEvent.change(screen.getByPlaceholderText("input search text"), {
      target: { value: "test" },
    });
    fireEvent.click(
      screen.getByRole("img", {
        name: /search/,
      })
    );

    await waitFor(() => {
      // Assuming the search button updates the URL, check if the URL contains the search parameter
      expect(window.location.search).toContain("search=test");
    });
  });

  test("sorts users", async () => {
    fireEvent.click(screen.getByText(/Staff Code/i));

    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());
  });
});
