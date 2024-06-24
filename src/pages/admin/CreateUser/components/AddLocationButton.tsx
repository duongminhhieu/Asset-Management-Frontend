import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { LocationAPICaller } from "@/services/apis/location.api";
import { useMutation } from "react-query";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { LocationRequest } from "@/types/LocationRequest";
import { Location } from "@/types/Location";
import APIResponse from "@/types/APIResponse";

interface AddLocationButtonProps {
  items: Location[];
  refetchLocations: () => void;
}

const AddLocationButton: React.FC<AddLocationButtonProps> = ({
  refetchLocations,
}) => {
  const [showInputs, setShowInputs] = useState(false);
  const [form] = Form.useForm<LocationRequest>();

  const { mutate, isLoading } = useMutation(LocationAPICaller.createLocation, {
    onSuccess: () => {
      form.setFieldsValue({ name: "", code: "" });
      setShowInputs(false);
      refetchLocations(); // Làm mới danh sách địa điểm sau khi tạo mới thành công
      message.success("Location added successfully");
    },
    onError: (error) => {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
      console.error("Error creating location:", error);
    },
  });

  const handleFieldsChange = () => {
    const name = form.getFieldValue("name");
    const code = form.getFieldValue("code");
    if (!name || !code || !name.trim()) {
      form.setFields([{ name: "code", errors: ["Not blank"] }]);
    } else if ( code.trim().length > 3) {
      form.setFields([{ name: "code", errors: ["Less than 3"] }]);
    }
  };

  const handleTextClick = () => setShowInputs(true);

  const handleCancelClick = () => {
    setShowInputs(false);
    form.setFieldsValue({ name: "", code: "" });
  };

  const onFinish = (values: LocationRequest) => {
    mutate(values);
  };

  const content = showInputs ? (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          autoComplete="on"
          onFieldsChange={handleFieldsChange}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Form.Item<LocationRequest>
              name="name"
              rules={[
                { required: true, message: "Name not null" },
                { max: 128, message: "Max length is 128" },
              ]}
              style={{ width: "80%" }}
            >
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item<LocationRequest>
              name="code"
              rules={[{ required: true, message: "Code is required" }]}
            >
              <Input placeholder="Code" />
            </Form.Item>

            <Form.Item className="flex justify-end">
              <Button
                type="default"
                htmlType="submit"
                className="bg-[#E20D1]"
                loading={isLoading}
              >
                <CheckOutlined style={{ fontSize: "16px", color: "green" }} />
              </Button>
            </Form.Item>
            <Form.Item className="flex justify-end">
              <Button onClick={handleCancelClick} className="bg-[#E20D1]">
                <CloseOutlined style={{ fontSize: "16px", color: "red" }} />
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  ) : (
    <span onClick={handleTextClick}>Add new location</span>
  );

  return <div>{content}</div>;
};

export default AddLocationButton;
