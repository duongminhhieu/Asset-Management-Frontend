import SearchFieldComponent from "./SearchFieldComponent";

import { render, screen } from "@testing-library/react";

const onSearch = jest.fn();

describe("SearchComponet", () => {
  const renderComponent = () => {
    return render(<SearchFieldComponent onSearch={onSearch} />);
  };

  test("should render the SerchComponent", () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText("input search text")
    ).toBeInTheDocument();
  });
});
