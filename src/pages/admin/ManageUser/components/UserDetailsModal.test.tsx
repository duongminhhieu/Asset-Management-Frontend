import { RenderResult, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserDetailsModal from "./UserDetailsModal";

describe("Test User Details Modal", () => {
  let component: RenderResult;

  beforeEach(() => {
    component = render(
      <BrowserRouter>
        <UserDetailsModal
          data={{
            id: 0,
            staffCode: "SD1234",
            firstName: "An",
            lastName: "Tran Van",
            username: "antv1",
            joinDate: new Date("10/10/2010"),
            dob: new Date("2/9/1990"),
            gender: "MALE",
            status: "ACTIVE",
            type: "ADMIN",
            location: {
              id: 1,
              name: "Ho Chi Minh",
            },
          }}
          show={true}
        />
        <UserDetailsModal
          data={{
            id: 0,
            staffCode: "SD1234",
            firstName: "An",
            lastName: "Tran Van",
            username: "antv1",
            joinDate: new Date("10/10/2010"),
            dob: new Date("2/9/1990"),
            gender: "MALE",
            status: "ACTIVE",
            type: "ADMIN",
            location: {
              id: 1,
              name: "Ho Chi Minh",
            },
          }}
        />
      </BrowserRouter>
    );
  });

  test("Render", () => {
    expect(component.getByText("Staff Code")).toBeInTheDocument();
    expect(component.getByText("Full name")).toBeInTheDocument();
    expect(component.getByText("Username")).toBeInTheDocument();
    expect(component.getByText("Date of Birth")).toBeInTheDocument();
    expect(component.getByText("Gender")).toBeInTheDocument();
    expect(component.getByText("Joined Date")).toBeInTheDocument();
    expect(component.getByText("Type")).toBeInTheDocument();
    expect(component.getByText("Location")).toBeInTheDocument();
  });
});
