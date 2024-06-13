import { useState } from "react";
import { Button } from "antd";
import { Route, Routes } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route
          path="/hello-world"
          element={
            <div>
              <h1>Hello World</h1>
              <Button onClick={() => setCount(count + 1)}>Click me</Button>
              <p>Count: {count}</p>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
