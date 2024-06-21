import React, { useState, useEffect, useRef } from "react";
import { Divider, Select, Space, message } from "antd";
import APIResponse from "../../../../types/APIResponse";
import { useQuery } from "react-query";
import { CategoryAPICaller } from "../../../../services/apis/category.api";
import AddCategoryButton from "./AddCategoryButton";

interface Item {
  name: string;
}

interface SelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const App: React.FC<SelectorProps> = ({ value, onChange }) => {
  const [items, setItems] = useState<Item[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // query
  const { data, isError, error, isSuccess } = useQuery(
    "getAllCategories",
    CategoryAPICaller.getAll
  );

  // effect
  useEffect(() => {
    console.log("check run");
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
      console.log(error);
    }

    if (isSuccess) {
      setItems(data.data.result);
      console.log(data.data.result);
    }
  }, [isError, isSuccess, data]);

  return (
    <Select
      value={value}
      onChange={onChange}
      //style={{ width: auto }}
      placeholder=""
      dropdownRender={(menu) => (
        <>
          <div ref={dropdownRef} style={{ maxHeight: 108, overflowY: "auto" }}>
            {menu}
            <Divider style={{ margin: "8px 0" }} />
          </div>
          <Space style={{ padding: "0 8px 4px" }}>
            <div className="cursor-pointer mt-1">
              <AddCategoryButton items={items} setItems={setItems} />
            </div>
          </Space>
        </>
      )}
      options={items.map((item) => ({
        label: item["name"],
        value: item["name"],
      }))}
    />
  );
};

export default App;
