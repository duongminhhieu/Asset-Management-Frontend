import { Header } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";

function HeaderUser() {
  const navigate = useNavigate();

  return (
    <Header className=" bg-[#CF2338] drop-shadow-md flex items-center lg:h-20 justify-center sticky top-0 left-0 z-50">
      <div className="flex justify-between items-center w-full">
        <div
          className="flex justify-center items-center cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <img src="/nashtech-logo.png" className="w-16 mr-8" alt="logo" />
          <h1 className="text-2xl font-semibold text-white font-serif">
            Online Asset Management
          </h1>
        </div>
      </div>
    </Header>
  );
}

export default HeaderUser;
