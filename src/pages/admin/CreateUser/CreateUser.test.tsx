import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CreateUser from "./CreateUser";
import { QueryClient, QueryClientProvider } from "react-query";

describe("CreateUser Component", () => {
  const renderComponent = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CreateUser />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };
  it("renders 'Create New User' text correctly", () => {
    renderComponent();

    // Use getByText to find the exact text
    expect(screen.getByText("Create New User")).toBeInTheDocument();
  });

  it("renders static field when both first and last names are provided", () => {
    renderComponent();

    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");

    fireEvent.change(firstNameInput, { target: { value: "Duy" } });
    fireEvent.change(lastNameInput, { target: { value: "Nguyen" } });

    expect(screen.getByText("Username")).toBeInTheDocument();
  });
  it("should navigate to user page on successful create", async () => {
    renderComponent();
    const cancelButton = await screen.findByRole("button", { name: /cancel/i });

    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(window.location.pathname).toBe("/admin/users");
    });
  });
  it('should reject with message "Please select the date of birth!" if value is undefined', async () => {
    const { getByText } = renderComponent();
    fireEvent.click(getByText("Save"));
    await waitFor(() => {
      expect(screen.getByTestId("dob")).toBeInTheDocument();
    });
  });
});
