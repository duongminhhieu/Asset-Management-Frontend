import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ClickableText from "./AddCategoryButton";
import { QueryClient, QueryClientProvider } from "react-query";

jest.mock("../../../../services/apis/category.api", () => ({
  CategoryAPICaller: {
    createNew: jest.fn().mockResolvedValue({
      data: { result: { name: "New Category" } },
    }),
  },
}));

const queryClient = new QueryClient();

describe("ClickableText Component", () => {
  const mockSetItems = jest.fn();

  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <ClickableText items={[]} setItems={mockSetItems} />
      </QueryClientProvider>
    );
  });

  it('renders "Add new category" text initially', () => {
    expect(screen.getByText("Add new category")).toBeInTheDocument();
  });

  it('shows input fields and buttons when "Add new category" is clicked', () => {
    fireEvent.click(screen.getByText("Add new category"));

    expect(screen.getByPlaceholderText("Category")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Prefix")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /check/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("disables the save button initially", () => {
    fireEvent.click(screen.getByText("Add new category"));
    expect(screen.getByRole("button", { name: /check/i })).toBeDisabled();
  });

  it("enables the save button when both inputs are valid", () => {
    fireEvent.click(screen.getByText("Add new category"));

    fireEvent.change(screen.getByPlaceholderText("Category"), {
      target: { value: "Test Category" },
    });
    fireEvent.change(screen.getByPlaceholderText("Prefix"), {
      target: { value: "TC" },
    });

    expect(screen.getByRole("button", { name: /check/i })).toBeEnabled();
  });
});
