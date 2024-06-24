import React, { useState } from "react";
import { Checkbox, Space } from "antd";
import type { CheckboxProps } from "antd";
import { useSearchParams } from "react-router-dom";

interface Props {
  options: {value: string, label:string}[];
  paramName:string;
}

const CheckBoxGroup: React.FC<Props> = ({ options, paramName }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkedList, setCheckedList] = useState<string[]>(
    searchParams.get(paramName)?.split(",") || []
  );


  const checkAll = options.length === checkedList.length;

  const indeterminate =
    checkedList.length > 0 && checkedList.length < options.length;

  const onChange = (list: string[]) => {
    setCheckedList(list);
    setSearchParams((searchParams) => {
      if(list.length === 0 ){
        searchParams.delete(paramName);
      }else{searchParams.set(paramName, list.join(","));
      }
        
      return searchParams;
    });
  };

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
      setSearchParams((searchParams) => {
        if (e.target.checked){
            searchParams.set(paramName, options.map(option=>option.value).join(","));
          }else{
            searchParams.delete(paramName)
          }
        return searchParams;
      });
      setCheckedList(e.target.checked ? options.map(option=>option.value) : []);
  };

  return (
    <>
      <Space direction="vertical">
        <Checkbox id="all"
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          All
        </Checkbox>
        <Checkbox.Group value={checkedList} onChange={onChange}>
          <Space direction="vertical">
            {options.map((option,index) => (
              <Checkbox value={option.value} key={index} id={option.value}>{option.label}</Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </Space>
    </>
  );
};

export default CheckBoxGroup;
