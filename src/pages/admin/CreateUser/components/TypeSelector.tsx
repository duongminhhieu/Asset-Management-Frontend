import React, { useRef } from "react";
import { Select } from "antd";

interface SelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const TypeSelector: React.FC<SelectorProps> = ({ value, onChange }) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const userTypeOptions = [
    { label: "Staff", value: "USER" },
    { label: "Admin", value: "ADMIN" },
  ];

  return (
    <Select
      value={value}
      defaultValue="USER"
      onChange={onChange}
      style={{ maxWidth: 400 }}
      dropdownRender={(menu) => (
        <>
          <div ref={dropdownRef} style={{ maxHeight: 108, overflowY: "auto" }}>
            {menu}
          </div>
        </>
      )}
      options={userTypeOptions}
    />
  );
};

export default TypeSelector;
