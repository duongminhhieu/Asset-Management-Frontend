import { Form, Modal } from "antd";
import "./AssignmentDetailsModal.css"
import { AssignmentResponse } from "@/types/AssignmentResponse";
interface Props{
    data: AssignmentResponse;
    show?:boolean;
    handleClose?: ()=>void;
}
function AssignmentDetailsModal ({data, show=false, handleClose}:Props) {

    function formatDate(dateInput:Date) {
        // Extract day, month, and year from the date object
        const date = new Date(dateInput)
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero based
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
            Detailed Assignment Information
          </p>
          <br/>
          <hr/>
        </div>
      }
      open={show}
      footer={null}
      onCancel={handleClose}
    >
        <Form layout="horizontal">
          <Form.Item label="Assest Code" className="custom-form-item" data-testid="assetCode" labelCol={{ span: 6 }} labelAlign="left">
            <div>{data.asset.assetCode}</div>
          </Form.Item>
          <Form.Item label="Assest Name" className="custom-form-item" data-testid="assetName" labelCol={{ span: 6 }} labelAlign="left">
            <div>{data.asset.name}</div>
          </Form.Item>
          <Form.Item label="Specification" className="custom-form-item" data-testid="specification" labelCol={{  span: 6 }} labelAlign="left">
            <p>{data.asset.specification}</p>
          </Form.Item>
          <Form.Item label="Assigned to" className="custom-form-item" data-testid="assignedBy" labelCol={{  span: 6 }} labelAlign="left">
            <p>{data.assignTo}</p>
          </Form.Item>
          <Form.Item label="Assigned by" className="custom-form-item" data-testid="assignedTo" labelCol={{  span: 6 }} labelAlign="left">
            <p>{data.assignBy}</p>
          </Form.Item>
          <Form.Item label="Assigned Date" className="custom-form-item" data-testid="assignedDate" labelCol={{ span: 6 }} labelAlign="left">
            <p>{formatDate(data.assignedDate)}</p>
          </Form.Item>
          <Form.Item label="State" className="custom-form-item" data-testid="state" labelCol={{  span: 6 }} labelAlign="left">
            <p>{data.state}</p>
          </Form.Item>
          <Form.Item label="Note" className="custom-form-item" data-testid="note" labelCol={{  span: 6 }} labelAlign="left">
            <p>{data.note}</p>
          </Form.Item>
        </Form>
    </Modal>
  );
}

export default AssignmentDetailsModal;
