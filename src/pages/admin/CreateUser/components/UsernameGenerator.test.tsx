import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import UsernameGenerator from "./UsernameGenerator";

// Mock UserAPICaller for testing purposes
jest.mock("../../../../services/apis/user.api", () => ({
  UserAPICaller: {
    getUsernameGenerated: jest
      .fn()
      .mockResolvedValue({ data: { result: "mockusername" } }),
  },
}));

describe("UsernameGenerator Component", () => {
  // Create a new instance of QueryClient for each test
  const queryClient = new QueryClient();

  it("renders input field with generated username when firstName and lastName are provided", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UsernameGenerator label="Username" firstName="Duy" lastName="Nguyen" />
      </QueryClientProvider>
    );

    // Wait for the loading spinner to disappear
    await screen.findByRole("textbox");

    // Assert that the input field displays the generated username
    expect(screen.getByRole("textbox")).toHaveValue("mockusername");
  });
});
