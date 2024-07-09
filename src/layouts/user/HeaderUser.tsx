import ModalChangePassword from "@/components/ModalChangePassword/ModalChangePassword";
import { AuthAPICaller } from "@/services/apis/auth.api";
import APIResponse from "@/types/APIResponse";
import { User } from "@/types/User";
import getListBreadcrumb from "@/utils/getListBreadcrumb";
import {
  CaretDownOutlined,
  KeyOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Dropdown, MenuProps, Space, message } from "antd";
import { Header } from "antd/es/layout/layout";
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

function HeaderUser() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  // hooks
  const navigate = useNavigate();

  const user: User = JSON.parse(localStorage.getItem("user") || "{}");

  const { mutate } = useMutation(AuthAPICaller.logout, {
    onSuccess: () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      message.success("Logout success");
      navigate("/login");
    },
    onError: (error)=> {
      const errorResponse = error as APIResponse
      message.error(errorResponse.message)
    }
  });

  // handlers

  const items: MenuProps["items"] = [
    {
      label: "Change Password",
      key: "change-password",
      icon: <KeyOutlined />,
      onClick: () => {
        setIsOpenModal(true);
      },
    },

    {
      label: "Logout",
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        // localStorage.removeItem("user");
        // localStorage.removeItem("token");
        // message.success("Logout success");
        // navigate("/login");
        mutate();
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
      <ModalChangePassword
        isOpen={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
    </>
  );
}

export default HeaderUser;
