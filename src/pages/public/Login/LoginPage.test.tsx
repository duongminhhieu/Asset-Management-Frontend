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
import LoginPage from "./LoginPage";
import { AxiosHeaders, AxiosResponse } from "axios";
import APIResponse from "@/types/APIResponse";

// Mock the AuthAPICaller
jest.mock("../../../services/apis/auth.api");
const mockedAuthAPICaller = AuthAPICaller as jest.Mocked<typeof AuthAPICaller>;

const testToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiQURNSU4iLCJzdGF0dXMiOiJBQ1RJVkUiLCJzdWIiOiJhZG1pbkBsb2NhbC5jb20iLCJpYXQiOjE3MTg3MDQ1MjIsImV4cCI6MTcxOTMwOTMyMiwianRpIjoiZTFmM2JjNzktM2RmYy00MjI3LTg2NTgtNTFiMDE2MDM1YmNkIn0.Icokli_mT_wSODOzWsZbuvG06-xMQusjv5wvCpIO23c";

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

  beforeEach(() => {
    renderComponent();
  });

  test("should render the login page", () => {
    expect(
      screen.getByText("Welcome to Online Asset Management")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("should enable the login button when username and password are filled", () => {
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

  test("should navigate to home page on successful login", async () => {
    const response: AxiosResponse = {
      data: {
        internalCode: 1000,
        result: {
          token: testToken,
        },
      } as APIResponse,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    mockedAuthAPICaller.login.mockResolvedValueOnce(response);

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" },
      });

      fireEvent.click(screen.getByRole("button", { name: /login/i }));
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });

  test("should show error message when login API fails", async () => {
    const response: AxiosResponse = {
      data: {
        internalCode: 1006,
        message: "Username or password is incorrect",
      } as APIResponse,
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    mockedAuthAPICaller.login.mockRejectedValueOnce({
      response,
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "wrongpassword" },
      });

      fireEvent.click(screen.getByRole("button", { name: /login/i }));
    });

    const errorMessages = screen.getAllByText(
      "Username or password is incorrect. Please try again"
    );

    expect(errorMessages).toHaveLength(1);
  });

  test("should show error message when login API fails 2", async () => {
    const response: AxiosResponse = {
      data: {
        internalCode: 1999,
        message: "Username or password is incorrect",
      } as APIResponse,
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    mockedAuthAPICaller.login.mockRejectedValueOnce({
      response,
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "wrongpassword" },
      });

      fireEvent.click(screen.getByRole("button", { name: /login/i }));
    });

    const errorMessages = screen.getAllByText(
      "Username or password is incorrect. Please try again"
    );

    expect(errorMessages).toHaveLength(1);
  });
});
