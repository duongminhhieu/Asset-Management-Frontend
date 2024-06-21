import React, { useState } from "react";
import { Checkbox, Space } from "antd";
import type { CheckboxProps } from "antd";
import { useSearchParams } from "react-router-dom";

interface Props {
  options: string[];
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
      <Space direction="vertical">
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
            value={option}
            key={index}
            onChange={onChange}
            checked={option === checked}
          >
            {option}{" "}
          </Checkbox>
        ))}
      </Space>
    </>
  );
};

export default ExvlusiveCheckBoxes;
