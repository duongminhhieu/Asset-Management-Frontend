import React from "react";
import { Input, Form, Spin, Alert } from "antd";
import { useQuery } from "react-query";
import { UserAPICaller } from "../../../../services/apis/user.api";

interface UsernameGeneratorProps {
  label: string;
  firstName: string;
  lastName: string;
}

const fetchUsername = async (firstName: string, lastName: string) => {
  const encodedFirstName = encodeURIComponent(firstName);
  const encodedLastName = encodeURIComponent(lastName);
  const response = await UserAPICaller.getUsernameGenerated(encodedFirstName, encodedLastName);
  return response.data.result; 
};

const UsernameGenerator: React.FC<UsernameGeneratorProps> = ({
  label,
  firstName,
  lastName,
}) => {
  const { data: username, isLoading, isError } = useQuery(
    ["username", firstName, lastName],
    () => fetchUsername(firstName, lastName),
    {
      enabled: !!firstName && !!lastName,
    }
  );

  return (
    <Form.Item label={label} labelAlign="left">
      {isLoading ? (
        <Spin />
      ) : isError ? (
        <Alert message="Failed to fetch username" type="error" />
      ) : (
        <Input value={username} readOnly />
      )}
    </Form.Item>
  );
};

export default UsernameGenerator;
