import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "react-query";
import { BrowserRouter, useParams } from "react-router-dom";
import EditUser from "./EditUser";
import { UserAPICaller } from "@/services/apis/user.api";
import { AxiosHeaders, AxiosResponse } from "axios";
import APIResponse from "@/types/APIResponse";
import { act } from "react";

jest.mock("@/services/apis/user.api");
const mockedAssignmentAPICaller = UserAPICaller as jest.Mocked<
  typeof UserAPICaller
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
          <EditUser />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  test("does not render NotFoundPage for valid id", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "123" });
    const response: AxiosResponse = {
      data: {
        internalCode: 1000,
        result: {
          id: 1,
          firstName: "Khanh",
          lastName: "Ngo",
          dob: "2001-06-18",
          gender: "MALE",
          staffCode: "SD0105",
          username: "khanhn6",
          joinDate: "2024-06-18",
          status: "FIRST_LOGIN",
          type: "USER",
          location: { id: 3, name: "Ho Chi Minh", code: "HCM" },
          version: 0,
        },
      } as APIResponse,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    mockedAssignmentAPICaller.getUserById.mockResolvedValueOnce(response);

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
          firstName: "Khanh",
          lastName: "Ngo",
          dob: "2001-06-18",
          gender: "MALE",
          staffCode: "SD0105",
          username: "khanhn6",
          joinDate: "2024-06-18",
          status: "FIRST_LOGIN",
          type: "USER",
          location: { id: 3, name: "Ho Chi Minh", code: "HCM" },
          version: 0,
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
    mockedAssignmentAPICaller.getUserById.mockResolvedValueOnce(response);
    mockedAssignmentAPICaller.editUser.mockResolvedValueOnce(responseUpdate);

    renderPage();

    expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();

    expect(mockedAssignmentAPICaller.editUser).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(screen.getByText(/save/i));
    });
    waitFor(() => {
      expect(mockedAssignmentAPICaller.editUser).toHaveBeenCalled();
    });
  });
});
