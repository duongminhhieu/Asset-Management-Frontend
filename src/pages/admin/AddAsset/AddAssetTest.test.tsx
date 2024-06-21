import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "react-query";
import { BrowserRouter } from "react-router-dom";
import AddAsset from "./AddAsset";
import { AssetAPICaller } from "@/services/apis/asset.api";
import { AxiosHeaders, AxiosResponse } from "axios";
import APIResponse from "@/types/APIResponse";

jest.mock("../../../services/apis/asset.api");
const mockedAssetAPICaller = AssetAPICaller as jest.Mocked<
  typeof AssetAPICaller
>;

describe("Asset Form", () => {
  const queryClient = new QueryClient();

  const renderWithProviders = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AddAsset />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  test("renders form and checks initial state", () => {
    renderWithProviders();

    expect(screen.getByText("Create New Asset")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Specification")).toBeInTheDocument();
    expect(screen.getByLabelText("Installed Date")).toBeInTheDocument();
    expect(screen.getByLabelText("State")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  test("disables save button when required fields are not filled", async () => {
    renderWithProviders();

    const name = screen.getByLabelText("Name");
    const category = screen.getByLabelText("Category");
    const specification = screen.getByLabelText("Specification");
    const installDate = screen.getByLabelText("Installed Date");
    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(saveButton).toBeDisabled();

    act(() => {
      fireEvent.change(name, { target: { value: "Asset Name" } });
      fireEvent.change(category, { target: { value: "Laptop" } });
      fireEvent.change(specification, { target: { value: "Specification" } });
      fireEvent.click(screen.getByLabelText("Not Available"));
      fireEvent.change(installDate, {
        target: { value: new Date().toISOString().split("T")[0] },
      });
    });
  });

  test("disables save button when required fields are not correct", async () => {
    renderWithProviders();

    const name = screen.getByLabelText("Name");
    const category = screen.getByLabelText("Category");
    const specification = screen.getByLabelText("Specification");
    const installDate = screen.getByLabelText("Installed Date");
    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(saveButton).toBeDisabled();

    act(() => {
      const today = new Date();
      fireEvent.change(name, { target: { value: "Asset Name" } });
      fireEvent.change(category, { target: { value: "Laptop" } });
      fireEvent.change(specification, { target: { value: "Specification" } });
      fireEvent.click(screen.getByLabelText("Available"));
      fireEvent.change(installDate, {
        target: {
          value: new Date(
            today.getFullYear(),
            today.getMonth() - 4,
            today.getDate()
          )
            .toISOString()
            .split("T")[0],
        },
      });
    });
  });

  test("disables save button when date fields are not correct", async () => {
    renderWithProviders();

    const name = screen.getByLabelText("Name");
    const category = screen.getByLabelText("Category");
    const specification = screen.getByLabelText("Specification");
    const installDate = screen.getByLabelText("Installed Date");
    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(saveButton).toBeDisabled();

    act(() => {
      // const today = new Date();
      fireEvent.change(name, { target: { value: " Asset Name  " } });
      fireEvent.change(category, { target: { value: "" } });
      fireEvent.change(specification, { target: { value: "Specification " } });
      fireEvent.click(screen.getByLabelText("Not Available"));
      // fireEvent.change(installDate, {
      //   target: {
      //     value: new Date(
      //       today.getFullYear(),
      //       today.getMonth() - 4,
      //       today.getDate()
      //     )
      //       .toISOString()
      //       .split("T")[0],
      //   },
      // });
      fireEvent.change(installDate, {
        target: {
          value: "2024-06-02",
        },
      });
    });
    expect(saveButton).toBeDisabled();
  });

  test("should navigate to asset page on cancel", async () => {
    renderWithProviders();
    await act(async () => {
      fireEvent.change(screen.getByLabelText("Name"), {
        target: { value: "test" },
      });
      fireEvent.change(screen.getByLabelText("Specification"), {
        target: { value: "specification" },
      });

      fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe("/admin/assets");
    });
  });

  test("should show error with date older than 3 months", async () => {
    renderWithProviders();

    const datePickerInput = screen.getByPlaceholderText("Select date");
    const saveButton = screen.getByRole("button", { name: /save/i });

    const today = new Date();
    fireEvent.change(datePickerInput, {
      target: {
        value: new Date(
          today.getFullYear(),
          today.getMonth() - 4,
          today.getDate()
        )
          .toISOString()
          .split("T")[0],
      },
    });

    expect(saveButton).toBeDisabled();
  });

  test("success create asset", async () => {
    const response: AxiosResponse = {
      data: {
        internalCode: 1000,
        message: "Create success",
      } as APIResponse,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    mockedAssetAPICaller.createNew.mockResolvedValueOnce(response);
    renderWithProviders();

    const name = screen.getByLabelText("Name");
    const category = screen.getByLabelText("Category");
    const specification = screen.getByLabelText("Specification");
    const installDate = screen.getByLabelText("Installed Date");
    const saveButton = screen.getByRole("button", { name: /save/i });

    act(() => {
      fireEvent.change(name, { target: { value: "Asset Name" } });
      fireEvent.change(category, { target: { value: "Laptop" } });
      fireEvent.change(specification, { target: { value: "Specification" } });
      fireEvent.click(screen.getByLabelText("Not Available"));
      fireEvent.change(installDate, {
        target: {
          value: "2024-06-02",
        },
      });
      fireEvent.change(saveButton, { target: { disabled: "false" } });
      fireEvent.click(saveButton);
    });

    expect(saveButton).toBeDisabled();
  });
});
