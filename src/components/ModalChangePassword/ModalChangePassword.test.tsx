import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import ModalChangePassword from "./ModalChangePassword";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { UserAPICaller } from "@/services/apis/user.api";
import { AxiosHeaders, AxiosResponse } from "axios";
import APIResponse from "@/types/APIResponse";
import { EInternalCode } from "@/enums/InternalCode.enum";

jest.mock("@/services/apis/user.api");
const mockedUserAPICaller = UserAPICaller as jest.Mocked<typeof UserAPICaller>;
const setIsOpenModal = jest.fn();

describe("ModalChangePassword", () => {
  const renderComponent = () => {
    const queryClient = new QueryClient();

    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ModalChangePassword isOpen={true} setIsOpenModal={setIsOpenModal} />{" "}
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
    const oldPasswordInput = screen.getByLabelText("Old Password");
    const changePasswordButton = screen.getByRole("button", {
      name: /save/i,
    });

    expect(changePasswordButton).toBeDisabled();

    fireEvent.change(passwordInput, { target: { value: "Abc@123345" } });
    fireEvent.change(oldPasswordInput, { target: { value: "Abc@12334" } });

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

  test("should show error message when password equal old password", async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText("New Password");
    const oldPasswordInput = screen.getByLabelText("Old Password");
    const changePasswordButton = screen.getByRole("button", {
      name: /save/i,
    });

    fireEvent.change(passwordInput, { target: { value: "Abc@123345" } });
    fireEvent.change(oldPasswordInput, { target: { value: "Abc@123345" } });

    expect(changePasswordButton).toBeDisabled();
    expect(
      await screen.findByText(
        "New password must be different from old password"
      )
    ).toBeInTheDocument();
  });

  test("should call the change password API when the form is submitted", async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText("New Password");
    const oldPasswordInput = screen.getByLabelText("Old Password");
    const changePasswordButton = screen.getByRole("button", {
      name: /save/i,
    });

    fireEvent.change(passwordInput, { target: { value: "Abc@123345" } });
    fireEvent.change(oldPasswordInput, { target: { value: "Abc@12334" } });

    fireEvent.click(changePasswordButton);
  });

  test("should show error message when change password API fails", async () => {
    const response: AxiosResponse = {
      data: {
        internalCode: EInternalCode.WRONG_PASSWORD,
        message: "The current password is incorrect",
      } as APIResponse,
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    mockedUserAPICaller.changePassword.mockRejectedValueOnce({
      response,
    });

    renderComponent();

    const passwordInput = screen.getByLabelText("New Password");
    const oldPasswordInput = screen.getByLabelText("Old Password");
    const changePasswordButton = screen.getByRole("button", {
      name: /save/i,
    });

    fireEvent.change(passwordInput, { target: { value: "Abc@123345" } });
    fireEvent.change(oldPasswordInput, { target: { value: "Abc@12334" } });

    fireEvent.click(changePasswordButton);

    expect(
      await screen.findByText("Password is incorrect")
    ).toBeInTheDocument();
  });

  test("should show success message when change password API success", async () => {
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
    mockedUserAPICaller.changePassword.mockResolvedValueOnce(response);

    renderComponent();

    const passwordInput = screen.getByLabelText("New Password");
    const oldPasswordInput = screen.getByLabelText("Old Password");
    const changePasswordButton = screen.getByRole("button", {
      name: /save/i,
    });

    fireEvent.change(passwordInput, { target: { value: "Abc@123345" } });
    fireEvent.change(oldPasswordInput, { target: { value: "Abc@12334" } });

    fireEvent.click(changePasswordButton);

    expect(
      await screen.findByText("Your password has been changed successfully")
    ).toBeInTheDocument();
  });

  test("should close the modal when click on close button", async () => {
    renderComponent();

    const closeButton = screen.getByRole("button", { name: /cancel/i });

    fireEvent.click(closeButton);

    // check state open modal
    await waitFor(() => expect(setIsOpenModal).toHaveBeenCalledWith(false));
  });
});
