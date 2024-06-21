import { render, waitFor } from "@testing-library/react";
import { useQuery } from "react-query";
import Selector from "./Selector";

jest.mock("react-query", () => ({
  useQuery: jest.fn(),
}));

describe("Selector component", () => {
  const mockOnChange = jest.fn();

  const mockItems = [
    { name: "Category 1" },
    { name: "Category 2" },
    { name: "Category 3" },
  ];

  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        data: {
          result: mockItems,
        },
      },
      isError: false,
      error: null,
      isSuccess: true,
    });
  });

  it("displays error message on API error", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isError: true,
      error: {
        response: {
          data: {
            message: "API Error occurred",
          },
        },
      },
      isSuccess: false,
    });

    const { getByText } = render(<Selector onChange={mockOnChange} />);

    await waitFor(() => {
      expect(getByText("API Error occurred")).toBeInTheDocument();
    });
  });
});
