import { RenderResult, fireEvent, render } from "@testing-library/react";
import Filter from "./Filter";
import { BrowserRouter } from "react-router-dom";

describe("Test custom pagination", () =>{
    let component: RenderResult;

  beforeEach(() => {
    component = render(
      <BrowserRouter>
        <Filter title={"Title"} options={[{label:"Admin", value:"Admin"}, {label:"Staff", value:"Staff"}]} paramName={"type"}/>
      </BrowserRouter>
    );
  });
  
  test("render correctly", () =>{
    expect(component.getByText("Title")).toBeInTheDocument()
    expect(component.getByRole("button", {name: /filter/i})).toBeInTheDocument()
  })

  test("Pop up render when click on title", ()=>{
    const button = component.getByText("Title");
    fireEvent.click(button);

    expect(component.getByRole("tooltip")).toBeInTheDocument();
  })

  test("Pop up render when click on filter", ()=>{
    const button = component.getByRole("button", {name: /filter/i});
    fireEvent.click(button);

    expect(component.getByRole("tooltip")).toBeInTheDocument();
  })
})