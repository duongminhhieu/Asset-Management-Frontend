import React, { useState, useEffect } from "react";
import Selector from "./components/Selector";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Typography,
  message,
} from "antd";
import { AssetAPICaller } from "@/services/apis/asset.api";
import APIResponse from "../../../types/APIResponse";
import { useMutation } from "react-query";

interface FormValues {
  name?: string;
  category?: string;
  specification?: string;
  installedDate?: Date;
  state?: "available" | "not_available";
}

const App: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // query
  const { mutate, data, isLoading, isError, error, isSuccess } = useMutation(
    AssetAPICaller.createNew
  );

  // effect
  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
    }

    if (isSuccess) {
      message.success("Create success");
      console.log(data.data.result);
    }
  }, [isError, isSuccess]);

  const onFinish = (values: FormValues) => {
    mutate(values);
  };

  // Custom validator to check if the value is not null or whitespace
  const validateWhitespace = (_: unknown, value: string) => {
    if (value && !/^\s|\s$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error("Cannot empty and no start and trailing spaces")
    );
  };

  // Custom validator to datetime
  const validateInstalledDate = (_: unknown, value: Date) => {
    if (!value) {
      return Promise.reject("Please select the installed date!");
    }

    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    if (value > threeMonthsAgo) {
      return Promise.resolve();
    }

    return Promise.reject("Installed date must be less than 3 months ago!");
  };

  // handlers
  const handleFieldsChange = async () => {
    const name = form.getFieldValue("name");
    const category = form.getFieldValue("category");
    const specification = form.getFieldValue("specification");
    const installDate = form.getFieldValue("installDate");
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(new Date().getMonth() - 3);

    setIsButtonDisabled(
      /^\s|\s$/.test(name) ||
        !category ||
        /^\s|\s$/.test(specification) ||
        !installDate ||
        installDate < threeMonthsAgo
    );
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      layout="horizontal"
      style={{ maxWidth: 800 }}
      colon={false}
      requiredMark={false}
      onFinish={onFinish}
      onFieldsChange={handleFieldsChange}
    >
      <Typography className="text-xl font-semibold text-red-500 font-serif pb-5">
        Create New Asset
      </Typography>

      {/* Name */}
      <Form.Item
        label="Name"
        name="name"
        hasFeedback
        labelAlign="left"
        rules={[
          { validator: validateWhitespace },
          { max: 255, message: "Must be less than 255 characters!" },
        ]}
      >
        <Input />
      </Form.Item>

      {/* Category */}
      <Form.Item
        label="Category"
        name="category"
        hasFeedback
        labelAlign="left"
        rules={[{ required: true, message: "Please select a category!" }]}
      >
        <Selector />
      </Form.Item>

      {/* Specification */}
      <Form.Item
        label="Specification"
        name="specification"
        hasFeedback
        labelAlign="left"
        rules={[
          { max: 1024, message: "Must be less than 1024 characters!" },
          { validator: validateWhitespace },
        ]}
      >
        <Input.TextArea style={{ height: "100px" }} />
      </Form.Item>

      {/* Install Date */}
      <Form.Item
        label="Installed Date"
        name="installDate"
        hasFeedback
        rules={[{ validator: validateInstalledDate }]}
        labelAlign="left"
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      {/* State */}
      <Form.Item
        initialValue="available"
        name="state"
        label="State"
        labelAlign="left"
      >
        <Radio.Group className="flex flex-col">
          <Radio value="available">Available</Radio>
          <Radio value="not_available">Not Available</Radio>
        </Radio.Group>
      </Form.Item>

      {/* Button */}
      <div
        className="button-container"
        style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}
      >
        <Form.Item label="">
          <Button
            type="primary"
            danger
            htmlType="submit"
            disabled={isButtonDisabled}
            loading={isLoading}
          >
            Save
          </Button>
        </Form.Item>
        <Form.Item label="">
          <Button>Cancel</Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default App;
