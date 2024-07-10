import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Spin,
  Typography,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ModalSelectUser from "../CreateAssignment/components/ModalSelectUser";
import ModalSelectAsset from "../CreateAssignment/components/ModalSelectAsset";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
import { AssetResponse } from "@/types/Asset";
import { AssignmentAPICaller } from "@/services/apis/assignment.api";
import { useMutation, useQuery } from "react-query";
import APIResponse from "@/types/APIResponse";
import dayjs from "dayjs";
import { Assignment } from "@/types/Assignment";
import NotFoundPage from "@/components/404NotFound/NotFoundPage";
import { AssignmentResponse } from "@/types/AssignmentResponse";

type CreateAssignmentBody = {
  fullName: string;
  assetName: string;
  assignedDate: Date;
  note: string;
};

function EditAssignment() {
  // state
  const { id } = useParams<{ id: string }>();

  const isValidId = (id: string) => {
    return !isNaN(Number(id));
  };

  if (!isValidId(id as string)) {
    return <NotFoundPage />;
  }

  // state
  const [isModalSelectUserOpen, setIsModalSelectUserOpen] = useState(false);
  const [isModalSelectAssetOpen, setIsModalSelectAssetOpen] = useState(false);
  const [userSelected, setUserSelected] = useState<User>();
  const [assetSelected, setAssetSelected] = useState<AssetResponse>();
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // query
  const { mutate, data, isLoading, isError, error, isSuccess } = useMutation(
    AssignmentAPICaller.updateAssignment
  );

  const {
    data: assignmentData,
    isSuccess: isGetAssignmentSuccess,
    isLoading: isGetAssignmentLoading,
    error: getAssignmentError,
  } = useQuery(
    ["getAssignment", { id }],
    () => AssignmentAPICaller.getAssignment(Number.parseInt(id ?? "0")),
    { retry: false }
  );

  // useEffect
  useEffect(() => {
    if (isGetAssignmentSuccess && assignmentData) {
      const data = assignmentData?.data as APIResponse;
      const assignment = data.result as Assignment;

      form.setFieldsValue({
        fullName: `${assignment.assignTo.firstName} ${assignment.assignTo.lastName}`,
        assetName: assignment.asset.name,
        assignedDate: dayjs(assignment.assignedDate).valueOf(),
        note: assignment.note,
      });

      setUserSelected(assignment.assignTo);
      setAssetSelected(assignment.asset);
    }
  }, [isGetAssignmentSuccess, assignmentData]);

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
        .response?.data;
      message.error(errorResponse.message);
    }

    if (isSuccess) {
      const newAssignment: AssignmentResponse = data.data.result;
      navigate("/admin/assignments", {
        state: {
          assignment: newAssignment,
        },
      });
      message.success("Update assignment success");
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
    const body = {
      userId: userSelected?.id,
      assetId: assetSelected?.id,
      assignedDate: dayjs(values.assignedDate).format("YYYY-MM-DD"),
      note: values.note,
    };

    mutate({ assignmentId: Number.parseInt(id ?? "0"), body });
  };

  const handleFieldsChange = () => {
    const fields = form.getFieldsValue();
    const { fullName, assetName, assignedDate, note } = fields;

    setIsButtonDisabled(
      !fullName || !assetName || !assignedDate || note.length > 1024
    );
  };

  if (isGetAssignmentLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spin
          size="large"
          indicator={<LoadingOutlined spin />}
          className="text-[#cf2338]"
        />
      </div>
    );
  }

  if (getAssignmentError) {
    return <div>Assignment Not Found</div>;
  }

  return (
    <>
      <Typography className="text-xl font-semibold text-[#cf2338] font-serif pb-5">
        Edit Assignment
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
          getValueProps={(value) => ({ value: value && dayjs(Number(value)) })}
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
          labelAlign="left"
          hasFeedback
          rules={[{ max: 1024, message: "Must be less than 1024 characters!" }]}
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

export default EditAssignment;
