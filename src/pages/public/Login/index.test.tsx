import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthAPICaller } from "../../../services/apis/auth.api";
import LoginPage from ".";
import { AxiosHeaders, AxiosResponse } from "axios";

// Mock the AuthAPICaller
jest.mock("../../../services/apis/auth.api");
const mockedAuthAPICaller = AuthAPICaller as jest.Mocked<typeof AuthAPICaller>;

describe("LoginPage", () => {
  const queryClient = new QueryClient();

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  test("should render the login page", () => {
    renderComponent();

    expect(
      screen.getByText("Welcome to Online Asset Management")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("should enable the login button when username and password are filled", () => {
    renderComponent();

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button", { name: /login/i });

    expect(loginButton).toBeDisabled();

    act(() => {
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
    });

    expect(loginButton).toBeEnabled();
  });

  test("should display an error message when login fails", async () => {
    mockedAuthAPICaller.login.mockRejectedValueOnce({
      response: {
        data: {
          message: "Username or password is incorrect. Please try again",
        },
      },
    });

    renderComponent();

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "wrongpassword" },
      });

      fireEvent.click(screen.getByRole("button", { name: /login/i }));
    });

    await waitFor(() =>
      expect(
        screen.getByText("Username or password is incorrect. Please try again")
      ).toBeInTheDocument()
    );
  });

  test("should navigate to home page on successful login", async () => {
    const response: AxiosResponse = {
      data: { message: "Login success" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    mockedAuthAPICaller.login.mockResolvedValueOnce(response);

    renderComponent();

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
      });

      fireEvent.click(screen.getByRole("button", { name: /login/i }));
    });

    await waitFor(() =>
      expect(screen.getByText("Login success")).toBeInTheDocument()
    );
  });
});
