import { render, fireEvent, screen } from "@testing-library/react";
import TypeSelector from "./TypeSelector";

describe("TypeSelector Component", () => {
  it("calls onChange handler when a different option is selected", () => {
    const handleChange = jest.fn();

    render(<TypeSelector onChange={handleChange} />);

    // Find the Select component from Ant Design
    const selectElement = screen.getByRole("combobox");

    // Simulate selecting the "Admin" option
    fireEvent.mouseDown(selectElement);
    const adminOption = screen.getByText("Admin");
    fireEvent.click(adminOption);

    // Check if onChange handler is called with the correct value object
    expect(handleChange).toHaveBeenCalledWith("ADMIN", {
      label: "Admin",
      value: "ADMIN",
    });
  });
});
