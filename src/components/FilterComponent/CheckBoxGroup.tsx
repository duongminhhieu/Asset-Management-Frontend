import React, { useEffect, useState } from "react";
import { Checkbox, Space } from "antd";
import type { CheckboxProps } from "antd";
import { useSearchParams } from "react-router-dom";

interface Props {
  options: { value: string; label: string }[];
  paramName: string;
}

const CheckBoxGroup: React.FC<Props> = ({ options, paramName }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkedList, setCheckedList] = useState<string[]>(
    searchParams.get(paramName)?.split(",") || []
  );

  useEffect(()=>{
    setCheckedList(searchParams.get(paramName)?.split(",") || [])
  },[paramName, searchParams])

  const checkAll = options.length === checkedList.length;

  const indeterminate =
    checkedList.length > 0 && checkedList.length < options.length;

  const onChange = (list: string[]) => {
    setCheckedList(list);
    setSearchParams((searchParams) => {
      if (list.length === 0) {
        searchParams.delete(paramName);
      } else {
        searchParams.set(paramName, list.join(","));
      }

      return searchParams;
    });
  };

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setSearchParams((searchParams) => {
      if (e.target.checked) {
        searchParams.set(
          paramName,
          options.map((option) => option.value.toString()).join(",")
        );
      } else {
        searchParams.delete(paramName);
      }
      return searchParams;
    });
    setCheckedList(
      e.target.checked ? options.map((option) => option.value.toString()) : []
    );
  };

  return (
    <>
      <Space
        direction="vertical"
        style={{ maxHeight: "200px", overflow: "auto" }}
      >
        <Checkbox
          id="all"
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          All
        </Checkbox>
        <Checkbox.Group value={checkedList} onChange={onChange}>
          <Space direction="vertical">
            {options.map((option, index) => (
              <Checkbox value={option.value.toString()} key={index} id={option.value.toString()}>
                {option.label}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </Space>
    </>
  );
};

export default CheckBoxGroup;
