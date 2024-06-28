import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "react-query";
import { BrowserRouter } from "react-router-dom";
import ModalSelectUser from "./ModalSelectUser";
import { act } from "react";
// import { AssignmentAPICaller } from "@/services/apis/assignment.api";
// import { AxiosHeaders, AxiosResponse } from "axios";
// import APIResponse from "@/types/APIResponse";
// import { AssetAPICaller } from "@/services/apis/asset.api";

// jest.mock("@/services/apis/asset.api");
// const mockedAssetAPICaller = AssetAPICaller as jest.Mocked<
//   typeof AssetAPICaller
// >;

const setIsOpenModal = jest.fn();
const setUserSelected = jest.fn();

describe("Modal Select User", () => {
  const queryClient = new QueryClient();

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ModalSelectUser
            isOpen={true}
            setIsOpenModal={setIsOpenModal}
            setUserSelected={setUserSelected}
          />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  test("renders form and checks initial state", () => {
    renderComponent();

    expect(screen.getByText("Select User")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("disables save button", async () => {
    renderComponent();

    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(saveButton).toBeDisabled();
  });

  test("disables save button when required fields are not filled", async () => {
    renderComponent();

    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(saveButton).toBeDisabled();
  });

  test("cancel button works", async () => {
    renderComponent();

    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    expect(setIsOpenModal).not.toHaveBeenCalled();

    cancelButton.click();

    expect(setIsOpenModal).toHaveBeenCalled();
  });

  test("sort users", async () => {
    renderComponent();

    const staffCode = screen.getByText(/Staff Code/i);

    staffCode.click();

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("sort descending", async () => {
    renderComponent();

    const staffCode = screen.getByText(/Staff Code/i);

    act(() => {
      fireEvent.click(staffCode);
      fireEvent.click(staffCode);
    });

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("sort users", async () => {
    renderComponent();

    const fullName = screen.getByText(/Full Name/i);

    fullName.click();

    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});
