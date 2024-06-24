import { RenderResult, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AssignmentHistory from "./AssignmentHistory";

describe("Test AssignmentHistory table", () => {
  let component: RenderResult;
  beforeEach(() => {
    component = render(
      <BrowserRouter>
        <AssignmentHistory
          data={[
            {
              assignedDate: new Date(),
              assignBy: "user1",
              assignTo: "user2",
              id: 1,
              returnDate: null,
            },
            {
                assignedDate: new Date(),
                assignBy: "user1",
                assignTo: "user2",
                id: 1,
                returnDate: new Date(),
              }
          ]}
        />
      </BrowserRouter>
    );
  });

  test("Render correctly", ()=>{
    expect(component.getByText("Date")).toBeInTheDocument();
    expect(component.getByText("Assigned to")).toBeInTheDocument();
    expect(component.getByText("Assigned by")).toBeInTheDocument();
    expect(component.getByText("Returned Date")).toBeInTheDocument();
  })
});
