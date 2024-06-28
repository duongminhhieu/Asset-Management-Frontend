import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CreateUser from "./CreateUser";
import { QueryClient, QueryClientProvider } from "react-query";

// Mock the necessary modules
jest.mock("@/services/apis/user.api", () => ({
  UserAPICaller: {
    createUser: jest.fn().mockResolvedValue({
      data: {
        result: [
          {
            id: 122,
            staffCode: "SD0122",
            firstName: "duy",
            lastName: "nguyen hoang",
            username: "duynh36",
            joinDate: "2024-06-27",
            dob: "2001-01-01",
            gender: "MALE",
            status: "FIRST_LOGIN",
            type: "USER",
            location: {
              id: 3,
              name: "Ho Chi Minh",
              code: "HCM",
            },
          },
        ],
      },
    }),
  },
}));

describe("CreateUser Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
  it("should navigate to user page on click cancel button", async () => {
    renderComponent();
    const cancelButton = await screen.findByRole("button", { name: /cancel/i });

    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(window.location.pathname).toBe("/admin/users");
    });
  });
  test('should reject with message "Please select the date of birth!" if value is undefined', async () => {
    const { getByText } = renderComponent();
    fireEvent.click(getByText("Save"));
    await waitFor(() => {
      expect(screen.getByTestId("dob")).toBeInTheDocument();
    });
  });
  it("should create a user successfully", async () => {
    renderComponent();

    // Fill out the form
    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "duy" },
    });
    fireEvent.change(screen.getByLabelText("Last Name"), {
      target: { value: "nguyen hoang" },
    });
    fireEvent.change(screen.getByLabelText("Date of Birth"), {
      target: { value: "2001-01-01" },
    });
    fireEvent.click(screen.getByTestId("male-option"));

    fireEvent.change(screen.getByLabelText("Joined Date"), {
      target: { value: "2024-06-27" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/admin/users");
    });
  });
});
