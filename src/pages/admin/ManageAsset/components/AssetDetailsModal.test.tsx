import { RenderResult, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AssetDetailsModal from "./AssetDetailsModal";
import { QueryClient, QueryClientProvider } from "react-query";
import { AssignmentAPICaller } from "@/services/apis/assignment.api";
import { AxiosHeaders, AxiosResponse } from "axios";
import APIResponse from "@/types/APIResponse";
import { AssetResponse } from "@/types/Asset";

jest.mock("@/services/apis/assignment.api");
const mockedAssignmentAPICaller = AssignmentAPICaller as jest.Mocked<typeof AssignmentAPICaller>;

describe("Test User Details Modal", () => {
  let component: RenderResult;
  const queryClient = new QueryClient();

  const asset = {
    id: 1,
    name: "Lapto Hp 1",
    specification: "core i5",
    category: "Laptop",
    assetCode: "LP0001",
    installDate: new Date(),
    state: "ASSIGNED",
    location: {
      id: 1,
      name: "Ho Chi Minh",
      code: "HCM",
    },
    EAssetSate:""
  } as AssetResponse;

  beforeEach(() => {
    component = render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AssetDetailsModal assetData={asset} show={true} />
        </BrowserRouter>
      </QueryClientProvider>
    );
  });

  test("Render", () => {
    expect(component.getByText("Asset Code")).toBeInTheDocument();
    expect(component.getByText("Asset name")).toBeInTheDocument();
    expect(component.getByText("Category")).toBeInTheDocument();
    expect(component.getByText("Installed date")).toBeInTheDocument();
    expect(component.getByText("State")).toBeInTheDocument();
    expect(component.getByText("Specification")).toBeInTheDocument();
    expect(component.getByText("History")).toBeInTheDocument();
    expect(component.getByText("Location")).toBeInTheDocument();
  });

  test("Render no history", ()=>{
    const response: AxiosResponse = {
      data: {
        internalCode: 1000,
        result: {
          data: []
        },
      } as APIResponse,
      status: 200,
      statusText: "",
      headers: {},
      config: {
        headers: AxiosHeaders.concat({}),
      },
    };
    mockedAssignmentAPICaller.getHistory.mockResolvedValue(response);
    expect(component.getByText("Date")).toBeInTheDocument();
    expect(component.getByText("Assigned to")).toBeInTheDocument();
    expect(component.getByText("Assigned by")).toBeInTheDocument();
    expect(component.getByText("Returned Date")).toBeInTheDocument();
  })
});
