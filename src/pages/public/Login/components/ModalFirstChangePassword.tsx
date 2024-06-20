import { UserAPICaller } from "@/services/apis/user.api";
import APIResponse from "@/types/APIResponse";
import { ValidatorType, validatorPassword } from "@/utils/validator";
import { Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

function ModalFirstChangePassword({
  isOpen,
  token,
}: {
  isOpen: boolean;
  token: string;
}) {
  // state
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();

  // query

  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    (body: { password: string }) =>
      UserAPICaller.firstChangePassword(body, token)
  );

  // effect
  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
    }
    if (isSuccess) {
      message.success("Change password success");
      navigate("/");
    }
  }, [isError, isSuccess]);

  // handlers
  const handleFieldsChange = () => {
    const password = form.getFieldValue("password");
    const validatorPass: ValidatorType = validatorPassword(password);

    if (!validatorPass.isValid) {
      setIsButtonDisabled(true);
      return;
    }
    setIsButtonDisabled(false);
  };

  const handleOk = () => {
    mutate({ password: form.getFieldValue("password") });
  };

  return (
    <>
      <Modal
        title={
          <div>
            <p className="text-lg font-semibold primary-color">
              Change Password
            </p>
          </div>
        }
        open={isOpen}
        onOk={handleOk}
        confirmLoading={isLoading}
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
        okText="Save"
        okButtonProps={{
          style: { backgroundColor: !isButtonDisabled ? "#E9424D" : undefined },
          disabled: isButtonDisabled,
        }}
      >
        <div className="flex flex-col text-sm">
          <p>This is the first time you logged in</p>
          <p>You have to change your password to continue.</p>

          <Form
            form={form}
            name="form_change_password_first"
            autoComplete="on"
            className="mt-4"
            onFieldsChange={handleFieldsChange}
          >
            <Form.Item
              label="New Password"
              name="password"
              rules={[
                () => ({
                  validator(_, value) {
                    const validatorPass: ValidatorType =
                      validatorPassword(value);
                    if (validatorPass.isValid) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error(validatorPass.message));
                    }
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default ModalFirstChangePassword;
