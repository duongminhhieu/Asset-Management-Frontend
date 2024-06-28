import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { Asset } from "@/types/Asset";
import dayjs from "dayjs";

interface FormValues {
  name?: string;
  category?: string;
  specification?: string;
  installedDate?: string;
  state: "available" | "not_available";
}

function AddAsset() {
  const [form] = Form.useForm<FormValues>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();

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
      const newAsset: Asset = data.data.result;
      message.success("Create success");
      navigate("/admin/assets", {
        state: {
          message: "Create success",
          asset: newAsset,
        },
      });
    }
  }, [isError, isSuccess]);

  const onFinish = (values: FormValues) => {
    let body = {
      ...values,
      installDate: dayjs(values.installedDate).format("YYYY-MM-DD"),
    };
    mutate(body);
  };

  const handleCancel = () => {
    navigate("/admin/assets");
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

  // handlers
  const handleFieldsChange = async () => {
    const name = form.getFieldValue("name");
    const category = form.getFieldValue("category");
    const specification = form.getFieldValue("specification");
    const installDate = form.getFieldValue("installDate");
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(new Date().getMonth() - 3);

    setIsButtonDisabled(
      !name ||
        /^\s|\s$/.test(name) ||
        !category ||
        !specification ||
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
      <Typography className="text-xl font-semibold text-[#cf2338] font-serif pb-5">
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
        <Input.TextArea style={{ height: "100px", overflow: "auto" }} />
      </Form.Item>

      {/* Install Date */}
      <Form.Item
        label="Installed Date"
        name="installDate"
        hasFeedback
        rules={[
          { required: true, message: "Please select the installed date!" },
        ]}
        labelAlign="left"
      >
        <DatePicker
          type="date"
          data-testid="install-date"
          style={{ width: "100%" }}
          disabledDate={(current) => {
            const today = new Date();
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(today.getMonth() - 3);
            threeMonthsAgo.setDate(today.getDate());
            const currentDate = current.toDate();
            return current && currentDate <= threeMonthsAgo;
          }}
        />
      </Form.Item>

      {/* State */}
      <Form.Item
        initialValue="available"
        name="state"
        // label="State"
        labelAlign="left"
      >
        <Radio.Group className="flex flex-col" aria-label="State">
          <Radio id="state" value="available" aria-label="Available">
            Available
          </Radio>
          <Radio id="state" value="not_available" aria-label="Not Available">
            Not Available
          </Radio>
        </Radio.Group>
      </Form.Item>

      {/* Button */}
      <div
        className="button-container"
        style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}
      >
        <Form.Item>
          <Button
            type="primary"
            name="save"
            danger
            htmlType="submit"
            disabled={isButtonDisabled}
            loading={isLoading}
          >
            Save
          </Button>
        </Form.Item>
        <Form.Item label="">
          <Button onClick={handleCancel}>Cancel</Button>
        </Form.Item>
      </div>
    </Form>
  );
}

export default AddAsset;
