import { RenderResult, fireEvent, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CustomPagination from "./CustomPagination";

describe("Test custom pagination", () =>{
    let component: RenderResult;
    const pageNumber = [1,2,3,4,5]

  beforeEach(() => {
    component = render(
      <BrowserRouter>
        <CustomPagination totalItems={100}/>
      </BrowserRouter>
    );
  });

  test("Pagination render", () =>{
    expect(component.getByText("Next")).toBeInTheDocument();
    expect(component.getByText("Previous")).toBeInTheDocument();
    pageNumber.forEach((num)=>{
        expect(component.getByText(String(num))).toBeInTheDocument();
    })
  })

  test("Clicks", ()=>{
    const prev = component.getByText("Previous");
    const next = component.getByText("Next");

    const page_two = component.getByText("2");
    fireEvent.click(next);

    expect(prev).toBeEnabled();

    fireEvent.click(prev);

    fireEvent.click(page_two)
    expect(prev).toBeEnabled();
    expect(next).toBeEnabled()
  })

})