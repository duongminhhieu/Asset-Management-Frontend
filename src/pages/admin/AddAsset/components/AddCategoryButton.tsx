import { Button, Form, FormProps, Input, message } from "antd";
import { useEffect, useState } from "react";
import { CategoryAPICaller } from "../../../../services/apis/category.api";
import { useMutation } from "react-query";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import APIResponse from "../../../../types/APIResponse";

// type
type FieldType = {
  name?: string;
  code?: string;
};

interface Item {
  name: string;
}

// prepare for send and get data from parent
interface ClickableTextProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

const ClickableText: React.FC<ClickableTextProps> = ({ items, setItems }) => {
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
      console.log(error);
    }

    if (isSuccess) {
      form.setFieldsValue({
        name: "",
        code: "",
      });
      setShowInputs(false);
      setItems([...items, { name: data.data.result.name }]);
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
        !(code.trim().length === 2)
    );
  };

  const handleTextClick = () => setShowInputs(true);

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

  // Custom validator to check if the value is not null or whitespace
  const validateWhitespace = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Length is 2"));
    }

    if (value && /^\s|\s$/.test(value)) {
      return Promise.reject(new Error("No spaces"));
    }

    if (value && value.length != 2) {
      return Promise.reject(new Error("Length is 2"));
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
              name="name"
              rules={[
                { required: true, message: "Name not null" },
                { max: 255, message: "Max length is 255" },
              ]}
              style={{ width: "80%" }}
            >
              <Input placeholder="Category" />
            </Form.Item>

            <Form.Item<FieldType>
              name="code"
              rules={[{ validator: validateWhitespace }]}
            >
              <Input placeholder="Prefix" />
            </Form.Item>

            <Form.Item className="flex justify-end">
              <Button
                type="default"
                htmlType="submit"
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
    <span onClick={handleTextClick}>Add new category</span>
  );

  return <div>{content}</div>;
};

export default ClickableText;
