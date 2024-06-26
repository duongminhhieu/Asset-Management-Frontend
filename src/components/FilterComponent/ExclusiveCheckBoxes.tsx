import React, { useEffect, useState } from "react";
import { Checkbox, Space } from "antd";
import type { CheckboxProps } from "antd";
import { useSearchParams } from "react-router-dom";

interface Props {
  options: { value: string; label: string }[];
  paramName: string;
}

const ExvlusiveCheckBoxes: React.FC<Props> = ({
  options,
  paramName,
}: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [checked, setChecked] = useState<string>(
    searchParams.get(paramName) || "All"
  );

  useEffect(()=>{
    setChecked(searchParams.get(paramName) || "All")
  },[paramName, searchParams])

  const onChange: CheckboxProps["onChange"] = (e) => {
    setChecked(e.target.value);
    setSearchParams((p) => {
      p.set(paramName, e.target.value);
      return p;
    });
  };

  const onCheckAll: CheckboxProps["onChange"] = (e) => {
    setChecked(e.target.value);
    setSearchParams((p) => {
      p.delete(paramName);
      return p;
    });
  };

  return (
    <>
      <Space
        direction="vertical"
        style={{ maxHeight: "200px", overflow: "auto" }}
      >
        <Checkbox
          value={"All"}
          key={"all"}
          onChange={onCheckAll}
          checked={checked === "All"}
        >
          {"All"}
        </Checkbox>
        {options.map((option, index) => (
          <Checkbox
            value={option.value.toString()}
            key={index}
            onChange={onChange}
            checked={option.value.toString() === checked}
          >
            {option.label}{" "}
          </Checkbox>
        ))}
      </Space>
    </>
  );
};

export default ExvlusiveCheckBoxes;
