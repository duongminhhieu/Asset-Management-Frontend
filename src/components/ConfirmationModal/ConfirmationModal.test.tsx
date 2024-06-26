// Import necessary utilities from testing-library
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
// Import the component to test
import ConfirmationModal from "./ConfirmationModal";

describe("ConfirmationModal", () => {
  const props = {
    isOpen: false,
    title: <span style={{ color: "red" }}>Test Title</span>,
    message: "Are you sure you want to proceed?",
    buttontext: "Proceed",
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  test("should not be visible when isOpen is false", () => {
    render(<ConfirmationModal {...props} />);
    expect(screen.queryByText(props.message)).not.toBeInTheDocument();
  });

  test("should display the modal with correct content when isOpen is true", () => {
    render(<ConfirmationModal {...props} isOpen={true} />);
    expect(screen.getByText("Test Title")).toHaveStyle("color: red");
    expect(screen.getByText(props.message)).toBeInTheDocument();
    expect(screen.getByText(props.buttontext)).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("should call onConfirm when the confirm button is clicked", () => {
    render(<ConfirmationModal {...props} isOpen={true} />);
    fireEvent.click(screen.getByText(props.buttontext));
    expect(props.onConfirm).toHaveBeenCalled();
  });

  test("should call onCancel when the cancel button is clicked", () => {
    render(<ConfirmationModal {...props} isOpen={true} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(props.onCancel).toHaveBeenCalled();
  });
});
