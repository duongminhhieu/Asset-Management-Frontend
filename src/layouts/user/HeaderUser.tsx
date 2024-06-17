import getListBreadcrumb from "@/utils/getListBreadcrumb";
import { Breadcrumb } from "antd";
import { Header } from "antd/es/layout/layout";

function HeaderUser({}) {
  return (
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
      </div>
    </Header>
  );
}

export default HeaderUser;
