import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "react-query";
import { BrowserRouter } from "react-router-dom";
import CreateAssignment from "./CreateAssignment";
import { act } from "react";
import { AssignmentAPICaller } from "@/services/apis/assignment.api";
import { AxiosHeaders, AxiosResponse } from "axios";
import APIResponse from "@/types/APIResponse";

jest.mock("@/services/apis/assignment.api");
const mockedAssignmentAPICaller = AssignmentAPICaller as jest.Mocked<
  typeof AssignmentAPICaller
>;

describe("Create Assignment", () => {
  const queryClient = new QueryClient();

  const renderPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CreateAssignment />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  test("renders form and checks initial state", () => {
    renderPage();

    expect(screen.getByText("Create New Assignment")).toBeInTheDocument();
    expect(screen.getByLabelText("User")).toBeInTheDocument();
    expect(screen.getByLabelText("Asset")).toBeInTheDocument();
    expect(screen.getByLabelText("Assigned Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Note")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  test("disables save button when required fields are not filled", async () => {
    renderPage();

    const user = screen.getByLabelText("User");
    const asset = screen.getByLabelText("Asset");
    const assignedDate = screen.getByLabelText("Assigned Date");
    const note = screen.getByLabelText("Note");
    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(saveButton).toBeDisabled();

    act(() => {
      fireEvent.change(user, { target: { value: "User" } });
      fireEvent.change(asset, { target: { value: "Asset" } });
      fireEvent.change(assignedDate, { target: { value: Date.now() } });
      fireEvent.change(note, { target: { value: "Note" } });
    });

    waitFor(() => {
      expect(saveButton).toBeEnabled();
    });
  });

  test("displays error message when create assignment failed", async () => {
    const response: AxiosResponse = {
      data: {
        internalCode: 1001,
        message: "Create assignment failed",
      } as APIResponse,
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    mockedAssignmentAPICaller.createAssignment.mockRejectedValueOnce({
      response,
    });

    renderPage();

    const user = screen.getByLabelText("User");
    const asset = screen.getByLabelText("Asset");
    const assignedDate = screen.getByLabelText("Assigned Date");
    const note = screen.getByLabelText("Note");
    const saveButton = screen.getByRole("button", { name: /save/i });

    act(() => {
      fireEvent.change(user, { target: { value: "User" } });
      fireEvent.change(asset, { target: { value: "Asset" } });
      fireEvent.change(assignedDate, { target: { value: Date.now() } });
      fireEvent.change(note, { target: { value: "Note" } });
    });

    act(() => {
      fireEvent.click(saveButton);
    });

    waitFor(() => {
      expect(screen.getByText("Create assignment failed")).toBeInTheDocument();
    });
  });

  test("displays success message when create assignment success", async () => {
    const response: AxiosResponse = {
      data: {
        internalCode: 1000,
        message: "Create assignment success",
      } as APIResponse,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    mockedAssignmentAPICaller.createAssignment.mockResolvedValueOnce(response);

    renderPage();

    const user = screen.getByLabelText("User");
    const asset = screen.getByLabelText("Asset");
    const assignedDate = screen.getByLabelText("Assigned Date");
    const note = screen.getByLabelText("Note");
    const saveButton = screen.getByRole("button", { name: /save/i });

    act(() => {
      fireEvent.change(user, { target: { value: "User" } });
      fireEvent.change(asset, { target: { value: "Asset" } });
      fireEvent.change(assignedDate, { target: { value: Date.now() } });
      fireEvent.change(note, { target: { value: "Note" } });
    });

    act(() => {
      fireEvent.click(saveButton);
    });

    waitFor(() => {
      expect(screen.getByText("Create assignment success")).toBeInTheDocument();
    });
  });
});
