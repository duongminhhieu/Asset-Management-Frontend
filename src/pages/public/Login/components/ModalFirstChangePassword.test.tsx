import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ModalChangePassword from "./ModalFirstChangePassword";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { AxiosHeaders, AxiosResponse } from "axios";
import APIResponse from "@/types/APIResponse";
import { UserAPICaller } from "@/services/apis/user.api";

// Mock
jest.mock("@/services/apis/user.api");
const mockedUserAPICaller = UserAPICaller as jest.Mocked<typeof UserAPICaller>;

const testToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiQURNSU4iLCJzdGF0dXMiOiJBQ1RJVkUiLCJzdWIiOiJhZG1pbkBsb2NhbC5jb20iLCJpYXQiOjE3MTg3MDQ1MjIsImV4cCI6MTcxOTMwOTMyMiwianRpIjoiZTFmM2JjNzktM2RmYy00MjI3LTg2NTgtNTFiMDE2MDM1YmNkIn0.Icokli_mT_wSODOzWsZbuvG06-xMQusjv5wvCpIO23c";

describe("ModalFirstChangePassword", () => {
  const renderComponent = () => {
    const queryClient = new QueryClient();

    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ModalChangePassword isOpen={true} token={testToken} />{" "}
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  test("renders without crashing", () => {
    renderComponent();

    expect(screen.getByText("Change Password")).toBeInTheDocument();
  });

  test("should enable the change password button when password is filled", () => {
    renderComponent();

    const passwordInput = screen.getByLabelText("New Password");
    const changePasswordButton = screen.getByRole("button", {
      name: /save/i,
    });

    expect(changePasswordButton).toBeDisabled();

    fireEvent.change(passwordInput, { target: { value: "Abc@123345" } });

    expect(changePasswordButton).toBeEnabled();
  });

  test("should show error message when password is invalid", async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText("New Password");
    const changePasswordButton = screen.getByRole("button", {
      name: /save/i,
    });

    fireEvent.change(passwordInput, { target: { value: "Abc@12" } });

    expect(changePasswordButton).toBeDisabled();

    expect(
      await screen.findByText("Password must be at least 8 characters long.")
    ).toBeInTheDocument();
  });

  test("should call the change password API when the form is submitted", async () => {
    const response: AxiosResponse = {
      data: {
        internalCode: 1000,
        message: "Change password success",
      } as APIResponse,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    mockedUserAPICaller.firstChangePassword.mockResolvedValueOnce(response);

    renderComponent();

    const passwordInput = screen.getByLabelText("New Password");
    const changePasswordButton = screen.getByRole("button", {
      name: /save/i,
    });

    fireEvent.change(passwordInput, { target: { value: "Abc@123345" } });

    fireEvent.click(changePasswordButton);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });

  test("should show error message when change password API fails", async () => {
    const response: AxiosResponse = {
      data: {
        internalCode: 1001,
        message: "Change password failed",
      } as APIResponse,
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    mockedUserAPICaller.firstChangePassword.mockRejectedValueOnce({
      response,
    });

    renderComponent();

    const passwordInput = screen.getByLabelText("New Password");
    const changePasswordButton = screen.getByRole("button", {
      name: /save/i,
    });

    fireEvent.change(passwordInput, { target: { value: "Abc@123345" } });

    fireEvent.click(changePasswordButton);

    expect(
      await screen.findByText("Change password failed")
    ).toBeInTheDocument();
  });
});
