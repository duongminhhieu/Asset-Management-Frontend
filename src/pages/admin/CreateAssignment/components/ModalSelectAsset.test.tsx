import { render, screen } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "react-query";
import { BrowserRouter } from "react-router-dom";
// import { AssignmentAPICaller } from "@/services/apis/assignment.api";
// import { AxiosHeaders, AxiosResponse } from "axios";
// import APIResponse from "@/types/APIResponse";
import ModalSelectAsset from "./ModalSelectAsset";
// import { AssetAPICaller } from "@/services/apis/asset.api";

// jest.mock("@/services/apis/asset.api");
// const mockedAssetAPICaller = AssetAPICaller as jest.Mocked<
//   typeof AssetAPICaller
// >;

const setIsOpenModal = jest.fn();
const setAsset = jest.fn();

describe("Modal Select Asset", () => {
  const queryClient = new QueryClient();

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ModalSelectAsset
            isOpen={true}
            setIsOpenModal={setIsOpenModal}
            setAsset={setAsset}
          />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  test("renders form and checks initial state", () => {
    renderComponent();

    expect(screen.getByText("Select Asset")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("disables save button", async () => {
    renderComponent();

    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(saveButton).toBeDisabled();
  });

  test("Cancel button works", async () => {
    renderComponent();

    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    cancelButton.click();

    expect(setIsOpenModal).toHaveBeenCalledWith(false);
  });

  test("sorts assets", async () => {
    renderComponent();

    const assetCode = screen.getByText(/Asset Code/i);

    assetCode.click();

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("sort descending", async () => {
    renderComponent();

    const assetCode = screen.getByText(/Asset Code/i);

    assetCode.click();
    assetCode.click();

    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});
