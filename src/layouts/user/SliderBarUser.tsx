import BannerLogoComponent from "@/components/BannerLogoComponent/BannerLogoComponent";
import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { useNavigate } from "react-router-dom";

import "@/layouts/SliderBar.css";

const items = [
  {
    key: "home",
    label: "Home",
  },
];

function SliderBarUser() {
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "home":
        navigate("/");
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
          defaultSelectedKeys={["home"]}
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

export default SliderBarUser;
