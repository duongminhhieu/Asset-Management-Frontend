import { Button, Card, Form, FormProps, Input, message } from "antd";
import { useEffect, useState } from "react";
import { AuthAPICaller } from "../../../services/apis/auth.api";
import { useMutation } from "react-query";
import APIResponse from "../../../types/APIResponse";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { JwtType } from "@/types/JwtType";
import { EUserStatus } from "@/enums/UserStatus.enum";
import { EInternalCode } from "@/enums/InternalCode.enum";
import ModalFirstChangePassword from "./components/ModalFirstChangePassword";

type FieldType = {
  username?: string;
  password?: string;
};

function LoginPage() {
  // state
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [token, setToken] = useState<string>("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [form] = Form.useForm<FieldType>();

  // hooks
  const navigate = useNavigate();

  // query
  const { mutate, isLoading, isError, error, isSuccess, data } = useMutation(
    AuthAPICaller.login
  );

  // effect
  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      if (
        errorResponse.internalCode === EInternalCode.EMAIL_OR_PASSWORD_INCORRECT
      ) {
        message.error("Username or password is incorrect. Please try again");
      } else {
        message.error(errorResponse.message);
      }
    }

    if (isSuccess) {
      if (isFirstLogin()) {
        setIsOpenModal(true);
      } else {
        navigate("/");
      }
    }
  }, [isError, isSuccess]);

  // handlers
  const handleFieldsChange = () => {
    const username = form.getFieldValue("username");
    const password = form.getFieldValue("password");
    setIsButtonDisabled(!username || !password);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    mutate(values);
  };

  const isFirstLogin = () => {
    const response = data?.data as APIResponse;
    setToken(response.result?.token);
    const decoded: JwtType = jwtDecode(response.result?.token);

    if (decoded.status === EUserStatus.FIRST_LOGIN) {
      return true;
    }
    return false;
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
          className="mt-10 lg:w-1/3 w-3/4 border border-black"
          bordered={true}
        >
          <Form
            form={form}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 25 }}
            name="form_login"
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
                color="#CF2338"
                htmlType="submit"
                disabled={isButtonDisabled}
                loading={isLoading}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {token.length > 0 && (
        <ModalFirstChangePassword isOpen={isOpenModal} token={token} />
      )}
    </>
  );
}

export default LoginPage;
