import { useState, useEffect, useRef } from "react";
import { Divider, Select, Space, message } from "antd";
import APIResponse from "../../../../types/APIResponse";
import { useQuery } from "react-query";
import { CategoryAPICaller } from "../../../../services/apis/category.api";
import AddCategoryButton from "./AddCategoryButton";
import { Category } from "@/types/Category";

interface SelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

function Selector({ value, onChange }: SelectorProps) {
  const [items, setItems] = useState<Category[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // query
  const { data, isError, error, isSuccess } = useQuery(
    "getAllCategories",
    CategoryAPICaller.getAll
  );

  // effect
  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
    }

    if (isSuccess) {
      setItems(data.data.result);
    }
  }, [isError, isSuccess, data]);

  useEffect(() => {
    if (items && dropdownRef.current) {
      dropdownRef.current.scrollTop = dropdownRef.current.scrollHeight;
    }
  }, [items]);

  return (
    <>
      <Select
        value={value}
        onChange={onChange}
        // placeholder=""
        listItemHeight={999}
        listHeight={9999}
        // id="category"
        aria-label="category"
        dropdownRender={(menu) => (
          <>
            <div ref={dropdownRef} style={{ maxHeight: 175, overflow: "auto" }}>
              {menu}
              <Divider style={{ margin: "8px 0" }} />
            </div>
            <Space style={{ padding: "0 8px 4px" }}>
              <div className="cursor-pointer mt-1 z-10">
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
    </>
  );
}

export default Selector;
