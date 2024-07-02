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
        <CustomPagination totalItems={100} pageSize={10} handleChange={()=>{}} currentPageNumber={1}/>
      </BrowserRouter>
    );
  });

  test("Pagination render", () =>{
    expect(component.getAllByText("Next")[0]).toBeInTheDocument();
    expect(component.getAllByText("Previous")[0]).toBeInTheDocument();
    pageNumber.forEach((num)=>{
        expect(component.getAllByText(String(num))[0]).toBeInTheDocument();
    })
  })

  test("Clicks", ()=>{
    const prev = component.getAllByText("Previous")[0];
    const next = component.getAllByText("Next")[0];

    const page_two = component.getAllByText("2")[0];
    fireEvent.click(next);

    expect(prev).toBeEnabled();

    fireEvent.click(prev);

    fireEvent.click(page_two)
    expect(prev).toBeEnabled();
    expect(next).toBeEnabled()
  })

})