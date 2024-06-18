import BannerLogoComponent from "@/components/BannerLogoComponent/BannerLogoComponent";
import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { useNavigate } from "react-router-dom";
import "@/layouts/SliderBar.css";
import getListBreadcrumb from "@/utils/getListBreadcrumb";

const items = [
  {
    key: "home",
    label: "Home",
  },
  {
    key: "users",
    label: "Manage User",
  },
  {
    key: "assets",
    label: "Manage Asset",
  },
  {
    key: "assignments",
    label: "Manage Assignment",
  },
  {
    key: "requestforreturn",
    label: "Request For Returning",
  },
  {
    key: "report",
    label: "Report",
  },
];

function SliderBarAdmin() {
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "home":
        navigate("/admin");
        break;
      case "users":
        navigate("/admin/users");
        break;
      case "assets":
        navigate("/admin/assets");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Sider
        width="18%"
        className="ml-12"
        style={{ backgroundColor: "transparent" }}
      >
        <BannerLogoComponent />
        <Menu
          className="h-fit rounded-lg custom-menu"
          defaultSelectedKeys={[
            getListBreadcrumb(window.location.pathname)[0].key,
          ]}
          onClick={onClick}
          mode="inline"
        >
          {items.map((item) => (
            <Menu.Item key={item.key} className="custom-menu-item bg-[#EFF1F5]">
              <div className="text-lg font-semibold">
                <span>{item.label}</span>
              </div>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    </>
  );
}

export default SliderBarAdmin;
