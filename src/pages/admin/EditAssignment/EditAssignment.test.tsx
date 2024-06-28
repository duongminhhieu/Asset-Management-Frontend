import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "react-query";
import { BrowserRouter, useParams } from "react-router-dom";
import EditAssignment from "./EditAssignment";
import { AssignmentAPICaller } from "@/services/apis/assignment.api";
import { AxiosHeaders, AxiosResponse } from "axios";
import APIResponse from "@/types/APIResponse";
import { act } from "react";

jest.mock("@/services/apis/assignment.api");
const mockedAssignmentAPICaller = AssignmentAPICaller as jest.Mocked<
  typeof AssignmentAPICaller
>;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("Edit Assignment", () => {
  const queryClient = new QueryClient();

  const renderPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <EditAssignment />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  test("renders NotFoundPage for invalid id", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "invalid" });

    renderPage();

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  test("does not render NotFoundPage for valid id", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "123" });
    const response: AxiosResponse = {
      data: {
        internalCode: 1000,
        result: {
          id: 1,
          assignedDate: "2024-12-12",
          note: "note",
          state: "WAITING",
          assignTo: {
            id: 3,
            firstName: "firstName",
            lastName: "lastName",
          },
          asset: {
            id: 2,
            name: "name",
            code: "code",
            state: "AVAILABLE",
          },
        },
      } as APIResponse,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    mockedAssignmentAPICaller.getAssignment.mockResolvedValueOnce(response);

    renderPage();

    expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();
  });

  test("submitting form calls API", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: "123" });
    const response: AxiosResponse = {
      data: {
        internalCode: 1000,
        result: {
          id: 1,
          assignedDate: "2024-12-12",
          note: "note",
          state: "WAITING",
          assignTo: {
            id: 3,
            firstName: "firstName",
            lastName: "lastName",
          },
          asset: {
            id: 2,
            name: "name",
            code: "code",
            state: "AVAILABLE",
          },
        },
      } as APIResponse,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    const responseUpdate: AxiosResponse = {
      data: {
        internalCode: 1000,
        message: "Update assignment success",
      } as APIResponse,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    mockedAssignmentAPICaller.getAssignment.mockResolvedValueOnce(response);
    mockedAssignmentAPICaller.updateAssignment.mockResolvedValueOnce(
      responseUpdate
    );

    renderPage();

    expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();

    expect(mockedAssignmentAPICaller.updateAssignment).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(screen.getByText(/save/i));
    });
    waitFor(() => {
      expect(mockedAssignmentAPICaller.updateAssignment).toHaveBeenCalled();
    });
  });
});
