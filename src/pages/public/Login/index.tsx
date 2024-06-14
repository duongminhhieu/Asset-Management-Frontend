import { Button, Card, Form, FormProps, Input, message } from "antd";
import { useEffect, useState } from "react";
import { AuthAPICaller } from "../../../services/apis/auth.api";
import { useMutation } from "react-query";
import APIResponse from "../../../types/APIResponse";
import { useNavigate } from "react-router-dom";

type FieldType = {
  username?: string;
  password?: string;
};

function LoginPage() {
  // state
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [form] = Form.useForm<FieldType>();

  // hooks
  const navigate = useNavigate();

  // query
  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    AuthAPICaller.login
  );

  // effect
  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
    }

    if (isSuccess) {
      message.success("Login success");
      navigate("/");
    }
  }, [isError, isSuccess]);

  // handlers
  const handleFieldsChange = () => {
    const username = form.getFieldValue("username");
    const password = form.getFieldValue("password");
    setIsButtonDisabled(!username || !password);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    await mutate(values);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <Card
          title={
            <div className="text-[#CF2338] font-semibold text-lg flex justify-center items-center">
              Welcome to Online Asset Management
            </div>
          }
          className="mt-10 w-1/3 border border-black"
          bordered={true}
        >
          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            autoComplete="on"
            onFieldsChange={handleFieldsChange}
          >
            <Form.Item<FieldType>
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item className="flex justify-end">
              <Button
                danger
                type="primary"
                htmlType="submit"
                className="bg-[#E20D1]"
                disabled={isButtonDisabled}
                loading={isLoading}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default LoginPage;
