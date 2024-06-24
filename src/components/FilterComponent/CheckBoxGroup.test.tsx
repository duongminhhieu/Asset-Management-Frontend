import { fireEvent, render, RenderResult } from "@testing-library/react";
import CheckBoxGroup from "./CheckBoxGroup"; // Adjust the import path as per your project structure
import { BrowserRouter } from "react-router-dom";

describe("CheckBoxGroup component", () => {
  const options = [{label:"Admin", value:"Admin"}, {label:"Staff", value:"Staff"}];
  const paramName = "type";

  let component: RenderResult;

  beforeEach(() => {
    component = render(
      <BrowserRouter>
        <CheckBoxGroup options={options} paramName={paramName} />
      </BrowserRouter>
    );
  });

  it('renders checkboxes with "All" checkbox', () => {
    const allCheckbox = component.getByText("All") as HTMLInputElement;
    expect(allCheckbox).toBeInTheDocument();

    options.forEach((option) => {
      const checkbox = component.getByText(option.label) as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();
    });
  });

  test('changes search parameters when checkboxes are clicked', () => {
    const optionCheckbox = component.getByLabelText(options[1].label);
    fireEvent.click(optionCheckbox);

    expect(optionCheckbox).toBeChecked()
    const allCheckbox = component.getByLabelText('All');
    fireEvent.click(allCheckbox);

    expect(allCheckbox).toBeChecked()
    options.forEach((option) => {
      const checkbox = component.getByLabelText(option.label);
      expect(checkbox).toBeChecked();
    });

    fireEvent.click(allCheckbox);

    expect(allCheckbox).not.toBeChecked()
    options.forEach((option) => {
      const checkbox = component.getByLabelText(option.label);
      expect(checkbox).not.toBeChecked();
    });
  });
});
