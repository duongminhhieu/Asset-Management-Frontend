import { ConfigProvider, Pagination, PaginationProps, Space } from "antd";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Props {
  totalItems: number;
}

const CustomPagination: React.FC<Props> = ({ totalItems }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page") || "1")
  );

  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement
  ) => {
    if (type === "prev") {
      return <a>Previous</a>;
    }
    if (type === "next") {
      return <a>Next</a>;
    }
    return originalElement;
  };

  const handleOnChange = (page: number) => {
    setSearchParams((p) => {
      p.set("page", String(page));
      return p;
    });
    setCurrentPage(page);
  };
  return (
    <Space.Compact>
      <ConfigProvider
        theme={{
          components: {
            Pagination: {
              colorPrimary: "#CF2338",
              colorPrimaryBorder: "#E9424D",
              colorPrimaryHover:"#CF2338",
            },
          },
        }}
      >
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={20}
          onChange={handleOnChange}
          showSizeChanger={false}
          showQuickJumper={false}
          showPrevNextJumpers={false}
          itemRender={itemRender}
        />
      </ConfigProvider>
    </Space.Compact>
  );
};

export default CustomPagination;
