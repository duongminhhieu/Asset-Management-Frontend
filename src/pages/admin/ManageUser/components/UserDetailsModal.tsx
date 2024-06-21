import { Form, Modal } from "antd";
import "./UserDetailsModal.css"
import { User } from "@/types/User";
interface Props{
    data: User;
    show?:boolean;
    handleClose?: ()=>void;
}
function UserDetailsModal({data, show=false, handleClose}:Props) {

    function formatDate(date:Date) {
        // Extract day, month, and year from the date object
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
            Detailed User Information
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
          <Form.Item label="Staff Code" className="custom-form-item"  labelCol={{ span: 6 }} labelAlign="left">
            <div>{data.staffCode}</div>
          </Form.Item>
          <Form.Item label="Full name" className="custom-form-item" labelCol={{ span: 6 }} labelAlign="left">
            <div>{data.firstName+" "+data.lastName}</div>
          </Form.Item>
          <Form.Item label="Username" className="custom-form-item" labelCol={{  span: 6 }} labelAlign="left">
            <p>{data.username}</p>
          </Form.Item>
          <Form.Item label="Date of Birth" className="custom-form-item" labelCol={{  span: 6 }} labelAlign="left">
            <p>{formatDate(data.dob)}</p>
          </Form.Item>
          <Form.Item label="Gender" className="custom-form-item" labelCol={{  span: 6 }} labelAlign="left">
            <p>{data.gender}</p>
          </Form.Item>
          <Form.Item label="Joined Date" className="custom-form-item" labelCol={{ span: 6 }} labelAlign="left">
            <p>{formatDate(data.joinDate)}</p>
          </Form.Item>
          <Form.Item label="Type" className="custom-form-item" labelCol={{  span: 6 }} labelAlign="left">
            <p>{data.type}</p>
          </Form.Item>
          <Form.Item label="Location" className="custom-form-item" labelCol={{  span: 6 }} labelAlign="left">
            <p>{data.location.name}</p>
          </Form.Item>
        </Form>
    </Modal>
  );
}

export default UserDetailsModal;
