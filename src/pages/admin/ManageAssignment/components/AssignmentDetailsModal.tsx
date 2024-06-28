import { Form, Modal } from "antd";
import "./AssignmentDetailsModal.css";
import { AssignmentResponse } from "@/types/AssignmentResponse";
interface Props {
  data: AssignmentResponse | undefined;
  show?: boolean;
  handleClose?: () => void;
}
function AssignmenDetailsModal({ data, show = false, handleClose }: Props) {
  function formatDate(dateInput: Date) {
    // Extract day, month, and year from the date object
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero based
    const year = date.getFullYear();

    // Return the formatted date string in DD/MM/YYYY format
    return `${day}/${month}/${year}`;
  }
  return (
    <Modal
      className=""
      title={
        <div>
          <p className="text-lg font-semibold primary-color">
            Detailed Assignment Infomation
          </p>
          <br />
          <hr />
        </div>
      }
      open={show}
      footer={null}
      onCancel={handleClose}
    >
      {data ? (
        <Form layout="horizontal">
          <Form.Item
            label="Asset Code"
            className="custom-form-item"
            labelCol={{ span: 6 }}
            labelAlign="left"
          >
            <div>{data.asset.assetCode}</div>
          </Form.Item>
          <Form.Item
            label="Asset Name"
            className="custom-form-item"
            labelCol={{ span: 6 }}
            labelAlign="left"
          >
            <div>{data.asset.name}</div>
          </Form.Item>
          <Form.Item
            label="Specification"
            className="custom-form-item"
            labelCol={{ span: 6 }}
            labelAlign="left"
          >
            <p>{data.asset.specification}</p>
          </Form.Item>
          <Form.Item
            label="Assigned to"
            className="custom-form-item"
            labelCol={{ span: 6 }}
            labelAlign="left"
          >
            <p>{data.assignTo}</p>
          </Form.Item>
          <Form.Item
            label="Assigned by"
            className="custom-form-item"
            labelCol={{ span: 6 }}
            labelAlign="left"
          >
            <p>{data.assignBy}</p>
          </Form.Item>
          <Form.Item
            label="Assigned Date"
            className="custom-form-item"
            labelCol={{ span: 6 }}
            labelAlign="left"
          >
            <p>{formatDate(data.assignedDate)}</p>
          </Form.Item>
          <Form.Item
            label="State"
            className="custom-form-item"
            labelCol={{ span: 6 }}
            labelAlign="left"
          >
            <p>{data.state}</p>
          </Form.Item>
          <Form.Item
            label="Note"
            className="custom-form-item"
            labelCol={{ span: 6 }}
            labelAlign="left"
          >
            <p>{data.note}</p>
          </Form.Item>
        </Form>
      ) : (
        <></>
      )}
    </Modal>
  );
}

export default AssignmenDetailsModal;
