// NotificationModal.test.jsx
import { render, screen } from "@testing-library/react";
import NotificationModal from "./NotificationModal";

describe("NotificationModal", () => {
  const title = "Test Title";
  const message = "Test message";
  const onCancelMock = jest.fn();

  it("should not display the modal when isOpen is false", () => {
    render(
      <NotificationModal
        isOpen={false}
        title={title}
        message={message}
        onCancel={onCancelMock}
      />
    );
    expect(screen.queryByText(title)).toBeNull();
  });

  it("should display the modal with correct title and message when isOpen is true", () => {
    render(
      <NotificationModal
        isOpen={true}
        title={title}
        message={message}
        onCancel={onCancelMock}
      />
    );
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
