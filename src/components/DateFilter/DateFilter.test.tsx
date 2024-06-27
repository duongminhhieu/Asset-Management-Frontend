import { fireEvent, render, screen, waitFor} from "@testing-library/react"
import DateFilter from "./DateFilter";
import { BrowserRouter } from "react-router-dom";
// import { useState } from "react";

// let mockSearchParam = '';

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useSearchParams: () => {
//     const [params, setParams] = useState(new URLSearchParams(mockSearchParam));
//     return [
//       params,
//       (newParams: ((prev: URLSearchParams) => URLSearchParams)) => {
//         mockSearchParam = newParams(params).toString();

//         setParams(new URLSearchParams(newParams(params)));
//       }
//     ];
//   }
// }));

describe('test date filter', () => { 
    beforeEach(() => {
        return render(
          <BrowserRouter>
            <DateFilter paramName="Date"/>
            <div data-testid="outside"/>
          </BrowserRouter>
        );
    });
    test("should render", ()=>{
        const filterBox = screen.getByRole("textbox");
        expect(filterBox).toBeInTheDocument();
    })

    test("when input date should update", async ()=>{
        const filterBox = screen.getByTestId("filter");
        // const newDate = "2024-10-07"
        fireEvent.click(filterBox);
        fireEvent.click(screen.getAllByText("1")[0]);
        await waitFor(()=>{
            // expect(screen.getAllByText("1")[0]).toBeInTheDocument()
            expect(window.location.href).toContain("Date")
        })
    })
 })