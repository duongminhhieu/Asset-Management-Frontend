import { useState } from "react";
import { Button } from "antd";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="text-red-400">Hello world!</div>
      <Button type="primary" onClick={() => setCount(count + 1)}>
        Increment
      </Button>

      <div>Count: {count}</div>
    </>
  );
}

export default App;
