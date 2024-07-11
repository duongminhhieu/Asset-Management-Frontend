import { Button, Form, FormProps, Input, message } from "antd";
import { useEffect, useState } from "react";
import { CategoryAPICaller } from "../../../../services/apis/category.api";
import { useMutation } from "react-query";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import APIResponse from "../../../../types/APIResponse";
import { Category } from "@/types/Category";

// type
type FieldType = {
  name?: string;
  code?: string;
};

// prepare for send and get data from parent
interface ClickableTextProps {
  items: Category[];
  setItems: React.Dispatch<React.SetStateAction<Category[]>>;
}

function AddCategoryButton({ items, setItems }: ClickableTextProps) {
  // state
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showInputs, setShowInputs] = useState(false);
  const [form] = Form.useForm<FieldType>();
  // query
  const { mutate, data, isLoading, isError, error, isSuccess } = useMutation(
    CategoryAPICaller.createNew
  );

  // effect
  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
    }

    if (isSuccess) {
      form.setFieldsValue({
        name: "",
        code: "",
      });
      const newCategory: Category = data.data.result;
      setShowInputs(false);
      setItems([...items, newCategory]);
      message.success("Category added successfully");
    }
  }, [isError, isSuccess]);

  // handlers
  const handleFieldsChange = () => {
    const name = form.getFieldValue("name");
    const code = form.getFieldValue("code");
    setIsButtonDisabled(
      !name ||
        !code ||
        !name.trim() ||
        !(code.length === 2) ||
        !(code.trim().length === 2) ||
        name.length > 255
    );
  };

  const handleTextClick = () => {
    setShowInputs(true);
  };

  const handleCancelClick = () => {
    setShowInputs(false);
    form.setFieldsValue({
      name: "",
      code: "",
    });
  };

  // trigger Mutation to post request
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    mutate(values);
  };

  const validateCode = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Not null"));
    }

    if (value && /^\s|\s$/.test(value)) {
      return Promise.reject(new Error("No spaces"));
    }

    if (value && value.length != 2) {
      return Promise.reject(new Error("Length is 2"));
    }

    return Promise.resolve();
  };

  const validateName = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Not null"));
    }

    if (value && /^\s|\s$/.test(value)) {
      return Promise.reject(new Error("No spaces"));
    }

    if (value && value.length > 255) {
      return Promise.reject(new Error("Length less than 255"));
    }

    return Promise.resolve();
  };

  const content = showInputs ? (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          autoComplete="on"
          onFieldsChange={handleFieldsChange}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Form.Item<FieldType>
              aria-label="Name"
              name="name"
              rules={[{ validator: validateName }]}
              style={{ width: "80%" }}
            >
              <Input placeholder="Category" />
            </Form.Item>

            <Form.Item<FieldType>
              arial-label="Code"
              name="code"
              rules={[{ validator: validateCode }]}
            >
              <Input placeholder="Prefix" />
            </Form.Item>

            <Form.Item className="flex justify-end">
              <Button
                type="default"
                htmlType="submit"
                name="save"
                className="bg-[#E20D1]"
                disabled={isButtonDisabled}
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
    <span onClick={handleTextClick} style={{ color: "red" }}>
      Add new category
    </span>
  );

  return <div>{content}</div>;
}
export default AddCategoryButton;
