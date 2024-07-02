import { AssignmentHistoryDto } from "@/types/Assignment";
import { Table, Typography } from "antd";

interface Props {
  data: AssignmentHistoryDto[];
  isLoading?: boolean;
}
function AssignmentHistory({ data, isLoading }: Props) {
  function formatDate(dateInput: Date) {
    // Extract day, month, and year from the date object
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero based
    const year = date.getFullYear();

    // Return the formatted date string in DD/MM/YYYY format
    return `${day}/${month}/${year}`;
  }
  const columns = [
    {
      key: "assignedDate",
      title: "Date",
      dataIndex: "assignedDate",
      render: (date: Date) => formatDate(date),
    },
    {
      key: "assignTo",
      title: "Assigned to",
      dataIndex: "assignTo",
      render: (username: string) => (
        <Typography.Paragraph
          ellipsis={{
            expandable: "collapsible",
          }}
        >
          {username}
        </Typography.Paragraph>
      ),
    },
    {
      key: "assignBy",
      title: "Assigned by",
      dataIndex: "assignBy",
      render: (username: string) => (
        <Typography.Paragraph
          ellipsis={{
            expandable: "collapsible",
          }}
        >
          {username}
        </Typography.Paragraph>
      ),
    },
    {
      key: "returnDate",
      title: "Returned Date",
      dataIndex: "returnDate",
      render: (date: Date) => (date ? formatDate(date) : null),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      loading={isLoading}
      rowKey={(record) => record.id}
    />
  );
}

export default AssignmentHistory;
