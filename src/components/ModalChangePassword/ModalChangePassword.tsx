import { EInternalCode } from "@/enums/InternalCode.enum";
import { UserAPICaller } from "@/services/apis/user.api";
import APIResponse from "@/types/APIResponse";
import { ValidatorType, validatorPassword } from "@/utils/validator";
import { Button, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

function ModalChangePassword({
  isOpen,
  setIsOpenModal,
}: {
  isOpen: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
}) {
  // state
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const navigate = useNavigate();

  // query
  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    (body: { password: string }) => UserAPICaller.changePassword(body)
  );

  // effect
  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      if (errorResponse.internalCode === EInternalCode.WRONG_PASSWORD) {
        form.setFields([
          {
            name: "password",
            errors: ["Password is incorrect"],
          },
        ]);
      }
    }
    if (isSuccess) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      setIsOpenModal(false);
      setIsSuccessModalOpen(true);
    }
  }, [isError, isSuccess]);

  // handlers
  const handleFieldsChange = () => {
    const password = form.getFieldValue("password");
    const validatorPass: ValidatorType = validatorPassword(password);
    const newPassword = form.getFieldValue("newPassword");
    const validatorNewPass: ValidatorType = validatorPassword(newPassword);

    if (!validatorPass.isValid || !validatorNewPass.isValid) {
      setIsButtonDisabled(true);
      return;
    }

    if (password === newPassword) {
      setIsButtonDisabled(true);
      return;
    }

    setIsButtonDisabled(false);
  };

  const handleOk = () => {
    const body = {
      password: form.getFieldValue("password"),
      newPassword: form.getFieldValue("newPassword"),
    };
    mutate(body);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsButtonDisabled(true);
    setIsOpenModal(false);
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
        destroyOnClose={true}
        onOk={handleOk}
        open={isOpen}
        closable={false}
        okText="Save"
        footer={[
          <Button
            key="save"
            onClick={handleOk}
            className="text-[#E9424D]"
            disabled={isButtonDisabled}
            danger
            loading={isLoading}
            type="primary"
          >
            Save
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <div className="flex flex-col text-sm">
          <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 24 }}
            name="form_change_password"
            autoComplete="on"
            className="mt-4"
            onFinish={handleOk}
            onFieldsChange={handleFieldsChange}
          >
            <Form.Item
              label="Old Password"
              name="password"
              hasFeedback
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
            <Form.Item
              label="New Password"
              name="newPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                () => ({
                  validator(_, value) {
                    const validatorPass: ValidatorType =
                      validatorPassword(value);

                    // check if new password is the same as old password --> reject
                    if (value === form.getFieldValue("password")) {
                      return Promise.reject(
                        new Error(
                          "New password must be different from old password"
                        )
                      );
                    }

                    if (validatorPass.isValid) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error(validatorPass.message));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        title={
          <div>
            <p className="text-lg font-semibold primary-color">
              Change Password
            </p>
          </div>
        }
        closable={false}
        open={isSuccessModalOpen}
        footer={
          <Button
            key="cancel"
            onClick={() => {
              navigate("/login");
            }}
          >
            Close
          </Button>
        }
        onCancel={() => setIsSuccessModalOpen(false)}
      >
        <p>Your password has been changed successfully</p>
      </Modal>
    </>
  );
}

export default ModalChangePassword;
