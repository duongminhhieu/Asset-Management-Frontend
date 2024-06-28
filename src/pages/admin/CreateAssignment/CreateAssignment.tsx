import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Typography, message } from "antd";
import ModalSelectUser from "./components/ModalSelectUser";
import { useEffect, useState } from "react";
import ModalSelectAsset from "./components/ModalSelectAsset";
import { User } from "@/types/User";
import { validateWhitespace } from "@/utils/validator";
import { AssetResponse } from "@/types/Asset";
import { useMutation } from "react-query";
import { AssignmentAPICaller } from "@/services/apis/assignment.api";
import APIResponse from "@/types/APIResponse";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { AssignmentResponse } from "@/types/AssignmentResponse";

type CreateAssignmentBody = {
  fullName: string;
  assetName: string;
  assignedDate: Date;
  note: string;
};

function CreateAssignment() {
  // state
  const [isModalSelectUserOpen, setIsModalSelectUserOpen] = useState(false);
  const [isModalSelectAssetOpen, setIsModalSelectAssetOpen] = useState(false);
  const [userSelected, setUserSelected] = useState<User>();
  const [assetSelected, setAssetSelected] = useState<AssetResponse>();
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // query
  const { mutate, data, isLoading, isError, error, isSuccess } = useMutation(
    AssignmentAPICaller.createAssignment
  );

  // useEffect

  useEffect(() => {
    if (userSelected) {
      form.setFieldsValue({
        fullName: `${userSelected.firstName} ${userSelected.lastName}`,
      });
    }

    if (assetSelected) {
      form.setFieldsValue({
        assetName: assetSelected.name,
      });
    }
  }, [userSelected, assetSelected]);

  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
    }

    if (isSuccess) {
      const newAssignment: AssignmentResponse = data.data.result;
      navigate("/admin/assignments", {
        state: {
          assignment: newAssignment,
        },
      });
      message.success("Create assignment success");
    }
  }, [isSuccess, isError]);

  // handlers
  const handleInputUser = () => {
    setIsModalSelectUserOpen(true);
  };

  const handleInputAsset = () => {
    setIsModalSelectAssetOpen(true);
  };

  const onFinish = (values: CreateAssignmentBody) => {
    // call api here
    const body = {
      ...values,
      userId: userSelected?.id,
      assetId: assetSelected?.id,
      assignedDate: dayjs(values.assignedDate).format("YYYY-MM-DD"),
    };
    mutate(body);
  };

  const handleFieldsChange = () => {
    const fields = form.getFieldsValue();
    const { fullName, assetName, assignedDate, note } = fields;

    setIsButtonDisabled(!fullName || !assetName || !assignedDate || !note);
  };

  return (
    <>
      <Typography className="text-xl font-semibold text-[#cf2338] font-serif pb-5">
        Create New Assignment
      </Typography>

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
        <Form.Item
          label="User"
          name="fullName"
          hasFeedback
          labelAlign="left"
          rules={[{ required: true, message: "Please select the user!" }]}
        >
          <Input
            readOnly
            suffix={<SearchOutlined />}
            onClick={handleInputUser}
            value={userSelected?.username}
            placeholder="Select User"
          />
        </Form.Item>

        <Form.Item
          label="Asset"
          name="assetName"
          hasFeedback
          labelAlign="left"
          rules={[{ required: true, message: "Please select asset" }]}
        >
          <Input
            readOnly
            onClick={handleInputAsset}
            suffix={<SearchOutlined />}
            placeholder="Select Asset"
          />
        </Form.Item>

        <Form.Item
          label="Assigned Date"
          name="assignedDate"
          hasFeedback
          rules={[
            { required: true, message: "Please select the assigned date!" },
          ]}
          labelAlign="left"
        >
          <DatePicker
            type="date"
            data-testid="assigned-date"
            style={{ width: "100%" }}
            disabledDate={(current) => {
              return (
                current && current.endOf("day").isBefore(new Date(), "day")
              );
            }}
            placeholder="Select Date"
          />
        </Form.Item>
        <Form.Item
          name="note"
          label="Note"
          hasFeedback
          labelAlign="left"
          rules={[
            { max: 1024, message: "Must be less than 1024 characters!" },
            { validator: validateWhitespace },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Note" />
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
              loading={isLoading}
              disabled={isButtonDisabled}
            >
              Save
            </Button>
          </Form.Item>
          <Form.Item label="">
            <Button
              onClick={() => {
                navigate("/admin/assignments");
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </div>
      </Form>

      <ModalSelectUser
        isOpen={isModalSelectUserOpen}
        setIsOpenModal={setIsModalSelectUserOpen}
        setUserSelected={setUserSelected}
      />
      <ModalSelectAsset
        isOpen={isModalSelectAssetOpen}
        setIsOpenModal={setIsModalSelectAssetOpen}
        setAsset={setAssetSelected}
      />
    </>
  );
}

export default CreateAssignment;
