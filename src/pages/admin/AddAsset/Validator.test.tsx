import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Form, DatePicker } from "antd";
// import { FormInstance } from "antd/es/form";

// The component to test
const TestComponent: React.FC = () => (
  <Form>
    <Form.Item
      label="Installed Date"
      name="installDate"
      hasFeedback
      rules={[
        () => ({
          validator(_: unknown, value: Date) {
            if (!value) {
              return Promise.reject(
                new Error("Please select the installed date!")
              );
            }

            const today = new Date();
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(today.getMonth() - 3);

            if (value > threeMonthsAgo) {
              return Promise.resolve();
            }

            return Promise.reject(
              new Error("Installed date must be less than 3 months ago!")
            );
          },
        }),
      ]}
      labelAlign="left"
    >
      <DatePicker style={{ width: "100%" }} />
    </Form.Item>
  </Form>
);

describe("FormItem Component", () => {
  it("should not show error message if date is within 3 months", async () => {
    const { getByLabelText, container } = render(<TestComponent />);

    const dateInput = getByLabelText("Installed Date") as HTMLInputElement;
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    container.appendChild(submitButton);

    const validDate = new Date();
    validDate.setDate(validDate.getDate() - 30);
    userEvent.type(dateInput, validDate.toISOString().substring(0, 10));
    userEvent.click(submitButton);

    const errorMessage = screen.queryByText(
      "Installed date must be less than 3 months ago!"
    );
    expect(errorMessage).toBeNull();
  });
});
