import { User } from "@/types/User";
import {
  CaretDownOutlined,
  KeyOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  MenuProps,
  Dropdown,
  Space,
  message,
  Modal,
  Button,
  Breadcrumb,
} from "antd";
import { Header } from "antd/es/layout/layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/layouts/BreadcrumbCustom.css";
import getListBreadcrumb from "@/utils/getListBreadcrumb";

function HeaderAdmin() {
  const [open, setOpen] = useState(false);

  // hooks
  const navigate = useNavigate();

  const user: User = JSON.parse(localStorage.getItem("user") || "{}");

  // handlers

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const items: MenuProps["items"] = [
    {
      label: "Change Password",
      key: "change-password",
      icon: <KeyOutlined />,
      onClick: () => {
        message.info("Coming soon!");
      },
    },

    {
      label: "Logout",
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        message.success("Logout success");
        navigate("/login");
        // showModal();
      },
    },
  ];

  return (
    <>
      <Header className=" bg-[#CF2338] drop-shadow-md flex items-center h-20 justify-center sticky top-0 left-0 z-50">
        <div className="flex justify-between items-center w-full">
          <div className="text-white">
            <Breadcrumb
              separator={
                <div className="text-white text-base font-normal"> {">"} </div>
              }
              className="font-semibold cursor-pointer text-lg"
              items={getListBreadcrumb(window.location.pathname)}
            />
          </div>

          <Dropdown placement="bottom" arrow menu={{ items }}>
            <Space className="cursor-pointer hover:opacity-75">
              <span className="text-white font-semibold">{user.username}</span>
              <CaretDownOutlined className="text-white" />
            </Space>
          </Dropdown>
        </div>
      </Header>

      <Modal
        open={open}
        title={
          <div className="text-red-600 text-base flex justify-center">
            Are you sure?
          </div>
        }
        onOk={handleOk}
        closable={false}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <Button>Custom Button</Button>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      ></Modal>
    </>
  );
}

export default HeaderAdmin;
