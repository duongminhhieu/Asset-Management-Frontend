import React, { useEffect, useRef } from "react";
import { Select, Space, Divider, Spin } from "antd";
import { LocationAPICaller } from "@/services/apis/location.api";
import { Location } from "../../../../types/Location";
import AddLocationButton from "./AddLocationButton";
import { useQuery } from "react-query";

interface LocationSelectorProps {
  value?: number;
  onChange?: (value: number) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const {
    data: locations,
    isLoading,
    error,
    refetch,
  } = useQuery<Location[]>("locations", fetchLocations, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (locations && dropdownRef.current) {
      dropdownRef.current.scrollTop = dropdownRef.current.scrollHeight;
    }
  }, [locations]);

  async function fetchLocations(): Promise<Location[]> {
    const response = await LocationAPICaller.getAllLocations();
    return response.data.result;
  }

  const handleChange = (newValue: number) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  if (isLoading) return <Spin />;

  if (error) {
    console.error("Failed to fetch locations:", error);
    return <div>Failed to load locations</div>;
  }

  if (!locations || !Array.isArray(locations)) {
    return <div>No locations found</div>;
  }

  const defaultValue =
    value ?? (locations.length > 0 ? locations[0].id : undefined);

  return (
    <Select
      value={value}
      onChange={handleChange}
      defaultValue={defaultValue}
      listItemHeight={999}
      listHeight={9999}
      loading={isLoading}
      dropdownRender={(menu) => (
        <>
          <div ref={dropdownRef} style={{ maxHeight: 108, overflowY: "auto" }}>
            {menu}
            <Divider style={{ margin: "8px 0" }} />
          </div>
          <Space style={{ padding: "0 8px 4px" }}>
            <div className="cursor-pointer mt-1">
              <AddLocationButton items={locations} refetchLocations={refetch} />
            </div>
          </Space>
        </>
      )}
    >
      {locations.map((location) => (
        <Select.Option key={location.id} value={location.id}>
          {location.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default LocationSelector;
