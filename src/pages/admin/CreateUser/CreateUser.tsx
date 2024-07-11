import React, { useState } from "react";
import { Button, DatePicker, Form, Input, Radio, Typography } from "antd";
import TypeSelector from "./components/TypeSelector";
import LocationSelector from "./components/LocationSelector";
import UsernameGenerator from "./components/UsernameGenerator";
import { UserAPICaller } from "../../../services/apis/user.api";
import { UserRequest } from "@/types/UserRequest";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

interface FormValues {
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  joinDate: Date;
  role: string;
  location?: number;
}

const CreateUser: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [isStaticFieldVisible, setIsStaticFieldVisible] = useState(false);
  const [userType, setUserType] = useState<string>("USER");
  const [, setUsername] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();

  const onFinish = (values: FormValues) => {
    if (userType === "ADMIN" && !values.location) {
      values.location = 1;
    }

    const requestData: UserRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      dob: dayjs(values.dob).format("YYYY-MM-DD"),
      gender: values.gender,
      joinDate: dayjs(values.joinDate).format("YYYY-MM-DD"),
      role: values.role,
      locationId: values.location,
    };

    UserAPICaller.createUser(requestData)
      .then((response) => {
        navigate("/admin/users", { state: { newUser: response.data.result } });
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  const validateWhitespace = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Cannot be empty"));
    } else if (value.trim().length > 128) {
      return Promise.reject(
        new Error("Length must be less than 128 characters")
      );
    }

    // Check if the value contains only letters, digits, or underscores
    else if (/^[a-zA-Z ]+$/.test(value)) {
      return Promise.resolve();
    }

    return Promise.reject(new Error("Must not contains special chars"));
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

  const handleTypeChange = (value: string) => {
    setUserType(value);
    form.setFieldsValue({ role: value });
  };

  // Handlers
  const handleFieldsChange = () => {
    const fieldsValues = form.getFieldsValue();
    const firstName = form.getFieldValue("firstName") || "";
    const lastName = form.getFieldValue("lastName") || "";

    const isFirstNameValid = firstName.trim() !== "";
    const isLastNameValid = lastName.trim() !== "";
    const isDobValid = fieldsValues.dob != null;
    const isGenderValid = fieldsValues.gender != null;
    const isJoinDateValid = fieldsValues.joinDate != null;
    const isRoleValid = fieldsValues.role != null && fieldsValues.role !== "";

    setIsButtonDisabled(
      !(
        isFirstNameValid &&
        isLastNameValid &&
        isDobValid &&
        isGenderValid &&
        isJoinDateValid &&
        isRoleValid &&
        firstName.length <= 128 &&
        lastName.length <= 128
      )
    );
    setUsername(
      isFirstNameValid && isLastNameValid ? `${firstName} ${lastName}` : ""
    );
    setIsStaticFieldVisible(isFirstNameValid && isLastNameValid);
  };

  const handleBackUserPage = () => {
    navigate("/admin/users");
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
        Create New User
      </Typography>

      {/* First Name */}
      <Form.Item
        label="First Name"
        name="firstName"
        hasFeedback
        labelAlign="left"
        rules={[{ validator: validateWhitespace }]}
      >
        <Input data-testid="firstName" />
      </Form.Item>

      {/* Last Name */}
      <Form.Item
        label="Last Name"
        name="lastName"
        hasFeedback
        labelAlign="left"
        rules={[{ validator: validateWhitespace }]}
      >
        <Input />
      </Form.Item>

      {/* Static Field */}
      {isStaticFieldVisible && (
        <UsernameGenerator
          label="Username"
          firstName={form.getFieldValue("firstName")}
          lastName={form.getFieldValue("lastName")}
        />
      )}

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
          <Radio data-testid="male-option" value="FEMALE">
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
        <TypeSelector value={userType} onChange={handleTypeChange} />
      </Form.Item>

      {/* Location */}
      {userType === "ADMIN" && (
        <Form.Item
          label="Location"
          name="location"
          hasFeedback
          labelAlign="left"
        >
          <LocationSelector />
        </Form.Item>
      )}

      {/* Button */}
      <div
        className="button-container"
        style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}
      >
        <Form.Item>
          <Button
            type="primary"
            disabled={isButtonDisabled}
            danger
            htmlType="submit"
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

export default CreateUser;
