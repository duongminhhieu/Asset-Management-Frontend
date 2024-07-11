import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Typography,
  Select,
  message,
} from "antd";
import { UserAPICaller } from "../../../services/apis/user.api";
import { UserUpdateRequest } from "@/types/UserRequest";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import dayjs from "dayjs";

const { Option } = Select;

interface FormValues {
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  joinDate: Date;
  role: string;
  location?: number;
}

const EditUser: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [version, setVersion] = useState("");

  const { data, isLoading, error } = useQuery(["user", id], () =>
    UserAPICaller.getUserById(Number(id))
  );

  useEffect(() => {
    if (data) {
      const user = data.data.result;
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        dob: dayjs(user.dob),
        gender: user.gender,
        joinDate: dayjs(user.joinDate),
        role: user.type,
      });
      setVersion(data.data.result.version);
    }
  }, [data, form]);

  const onFinish = (values: FormValues) => {
    const requestData: UserUpdateRequest = {
      dob: dayjs(values.dob).format("YYYY-MM-DD"),
      gender: values.gender,
      joinDate: dayjs(values.joinDate).format("YYYY-MM-DD"),
      type: values.role,
      version: Number(version),
    };

    UserAPICaller.editUser(Number(id), requestData)
      .then((response) => {
        console.log(response.data.result);
        navigate("/admin/users", {
          state: { newUser: response.data.result },
        });
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const validateWhitespace = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Cannot be empty"));
    }
    return Promise.resolve();
  };

  const validatedob = (_: unknown, value: Date) => {
    if (!value) {
      return Promise.reject("Please select the date of birth!");
    }

    const today = new Date();
    const minDOB = new Date();
    minDOB.setFullYear(today.getFullYear() - 18);

    if (value <= minDOB) {
      return Promise.resolve();
    }

    return Promise.reject("Age must be at least 18 years old!");
  };

  const validateJoinDate = (_: unknown, value: Date) => {
    if (!value) {
      return Promise.reject("Please select the join date!");
    }

    // Kiểm tra join date phải trước dob
    const dob = form.getFieldValue("dob");
    if (dob && value < dob) {
      return Promise.reject("Join date must be after the Date of Birth!");
    }

    const date = new Date(value);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return Promise.reject("Join date cannot be on Saturday or Sunday!");
    }

    return Promise.resolve();
  };

  const handleBackUserPage = () => {
    navigate("/admin/users");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading user data</div>;
  }

  const handleFieldsChange = () => {
    const fields = form.getFieldsValue();
    const { dob, joinDate } = fields;

    setIsButtonDisabled(!dob || !joinDate);
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      layout="horizontal"
      style={{ maxWidth: 500 }}
      colon={false}
      requiredMark={false}
      onFinish={onFinish}
      onFieldsChange={handleFieldsChange}
    >
      <Typography className="text-xl font-semibold text-red-500 font-serif pb-5">
        Edit User
      </Typography>

      {/* First Name */}
      <Form.Item
        label="First Name"
        name="firstName"
        hasFeedback
        labelAlign="left"
        rules={[{ validator: validateWhitespace }]}
      >
        <Input data-testid="firstName" disabled />
      </Form.Item>

      {/* Last Name */}
      <Form.Item
        label="Last Name"
        name="lastName"
        hasFeedback
        labelAlign="left"
        rules={[{ validator: validateWhitespace }]}
      >
        <Input disabled />
      </Form.Item>

      {/* Date of Birth */}
      <Form.Item
        label="Date of Birth"
        name="dob"
        hasFeedback
        rules={[{ validator: validatedob }]}
        labelAlign="left"
      >
        <DatePicker
          data-testid="dob"
          style={{ width: "100%" }}
          placeholder=" "
        />
      </Form.Item>

      {/* Gender */}
      <Form.Item
        name="gender"
        label="Gender"
        labelAlign="left"
        data-testid="gender"
        rules={[{ required: true, message: "Please select a gender!" }]}
      >
        <Radio.Group className="flex flex-row">
          <Radio data-testid="female-option" value="FEMALE">
            Female
          </Radio>
          <Radio value="MALE">Male</Radio>
        </Radio.Group>
      </Form.Item>

      {/* Join Date */}
      <Form.Item
        label="Joined Date"
        name="joinDate"
        hasFeedback
        rules={[{ validator: validateJoinDate }]}
        labelAlign="left"
      >
        <DatePicker
          data-testid="joinDate"
          style={{ width: "100%" }}
          placeholder=" "
        />
      </Form.Item>

      {/* Type */}
      <Form.Item
        aria-label="Type"
        initialValue="USER"
        label="Type"
        name="role"
        hasFeedback
        labelAlign="left"
        rules={[{ required: true, message: "Please select a type!" }]}
      >
        <Select>
          <Option value="USER">User</Option>
          <Option value="ADMIN">Admin</Option>
        </Select>
      </Form.Item>

      {/* Button */}
      <div
        className="button-container"
        style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}
      >
        <Form.Item>
          <Button
            type="primary"
            danger
            htmlType="submit"
            disabled={isButtonDisabled}
          >
            Save
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={handleBackUserPage}>Cancel</Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default EditUser;
