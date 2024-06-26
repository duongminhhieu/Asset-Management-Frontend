import { Flex, Form, Modal, message } from "antd";
import AssignmentHistory from "./AssignmentHistory";
import { AssetResponse } from "@/types/Asset";
import { useQuery } from "react-query";
import { AssignmentAPICaller } from "@/services/apis/assignment.api";
import { useEffect, useState } from "react";
import { AssignmentHistoryDto } from "@/types/Assignment";
import APIResponse from "@/types/APIResponse";

interface Props {
  assetData: AssetResponse;
  show?: boolean;
  handleClose?: () => void;
}
function AssetDetailsModal({ assetData, show, handleClose }: Props) {
  const [items, setItems] = useState<AssignmentHistoryDto[]>([]);
  function formatDate(dateInput: Date) {
    // Extract day, month, and year from the date object
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero based
    const year = date.getFullYear();

    // Return the formatted date string in DD/MM/YYYY format
    return `${day}/${month}/${year}`;
  }

  const {
    data: queryData,
    isSuccess,
    isError,
    isLoading,
    error,
  } = useQuery(["getAssetHistory", { assetData }], () =>
    AssignmentAPICaller.getHistory(assetData.id), {
      enabled:show,
    }
  );

  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
    }

    if (isSuccess) {
      setItems(queryData?.data?.result.data);
    }
  }, [error, isError, isSuccess, queryData]);
  return (
    <Modal
      title={
        <>
          <p className="text-lg font-semibold primary-color">
            Detailed Asset Information
          </p>
          <br />
          <hr />
        </>
      }
      open={show}
      footer={null}
      onCancel={handleClose}
      width={900}
    >
        <Form layout="horizontal">
          <Form.Item
            label="Asset Code"
            labelCol={{ offset: 2, span: 6 }}
            labelAlign="left"
            className="my-2"
          >
            <div>{assetData.assetCode}</div>
          </Form.Item>
          <Form.Item
            label="Asset name"
            labelCol={{ offset: 2, span: 6 }}
            labelAlign="left"
            className="my-2"
          >
            <div>{assetData.name}</div>
          </Form.Item>
          <Form.Item
            label="Category"
            labelCol={{ offset: 2, span: 6 }}
            labelAlign="left"
            className="my-2"
          >
            <p>{assetData.category}</p>
          </Form.Item>
          <Form.Item
            label="Installed date"
            labelCol={{ offset: 2, span: 6 }}
            labelAlign="left"
            className="my-2"
          >
            <p>{formatDate(assetData.installDate)}</p>
          </Form.Item>
          <Form.Item
            label="State"
            labelCol={{ offset: 2, span: 6 }}
            labelAlign="left"
            className="my-2"
          >
            <p>{assetData.state}</p>
          </Form.Item>
          <Form.Item
            label="Location"
            labelCol={{ offset: 2, span: 6 }}
            labelAlign="left"
            className="my-2"
          >
            <p>{assetData.location.name}</p>
          </Form.Item>
          <Form.Item
            label="Specification"
            labelCol={{ offset: 2, span: 6 }}
            labelAlign="left"
            className="my-2"
          >
            <p>{assetData.specification}</p>
          </Form.Item>
          <Form.Item
            label="History"
            labelCol={{ offset: 2, span: 6 }}
            labelAlign="left"
            className="my-2"
          >
            <AssignmentHistory data={items} isLoading={isLoading} />
          </Form.Item>
        </Form>
    </Modal>
  );
}

export default AssetDetailsModal;
