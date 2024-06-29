import CustomPagination from "@/components/Pagination/CustomPagination";
import SearchFieldComponent from "@/components/SearchFieldComponent/SearchFieldComponent";
import { UserAPICaller } from "@/services/apis/user.api";
import APIResponse from "@/types/APIResponse";
import { User } from "@/types/User";
import UserSearchParams from "@/types/UserSearchParams";
import {
  Button,
  Modal,
  Table,
  TableColumnsType,
  TableProps,
  message,
} from "antd";
import { SorterResult } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

const PAGE_SIZE = 10; 

function ModalSelectUser({
  isOpen,
  setIsOpenModal,
  setUserSelected,
}: {
  isOpen: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
  setUserSelected: (user: User) => void;
}) {
  // state
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [params, setParams] = useState<UserSearchParams>({
    searchString: "",
    type: "",
    orderBy: null,
    sortDir: null,
    pageNumber: 1,
    pageSize: PAGE_SIZE,
  });

  // query
  const {
    data: queryData,
    isError,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["getUserAssign", { params }],
    () => UserAPICaller.getUserAssign(params),
    { enabled: isOpen }
  );

  // effect
  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
    }
  }, [isError]);

  // handlers
  const onSearch = (value: string) => {
    setParams((params) => {
      params.searchString = value;
      params.pageNumber = 1;
      return params;
    });
    refetch();
  };

  const handleTableChange: TableProps<User>["onChange"] = (
    _pagination,
    _filteers,
    sorter
  ) => {
    sorter = sorter as SorterResult<User>;
    const { field, order } = sorter;

    const fieldString = field as string;
    setParams((params) => {
      params.orderBy = fieldString;
      return params;
    });

    if (order === "ascend") {
      setParams((params) => {
        params.sortDir = "asc";
        return params;
      });
    } else if (order === "descend") {
      setParams((params) => {
        params.sortDir = "desc";
        return params;
      });
    } else {
      setParams((params) => {
        params.sortDir = null;
        params.orderBy = null;
        return params;
      });
    }
    refetch();
  };

  const columns: TableColumnsType<User> = [
    {
      title: "Staff Code",
      dataIndex: "staffCode",
      showSorterTooltip: true,
      sorter: true, // add API later
      key: "staffCode",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      showSorterTooltip: true,
      sorter: true, // add API later
      render: (_text, record) => `${record.firstName} ${record.lastName}`,
      key: "fullName",
    },
    {
      key: "type",
      title: "Type",
      dataIndex: "type",
      showSorterTooltip: true,
      sorter: true, // add API later
      render: (_text, record) => {
        return record.type === "ADMIN" ? "Admin" : "Staff";
      },
    },
  ];

  const handlePageChange = (page : number) =>{
    setParams((params) => {
      params.pageNumber = page;
      return params;
    });
    refetch();
  }

  const rowSelection = {
    onChange: (_selectedRowKeys: React.Key[], selectedRows: User[]) => {
      setSelectedUser(selectedRows[0]);
      setIsButtonDisabled(false);
    },
    getCheckboxProps: (record: User) => ({
      name: record.firstName,
    }),
  };

  const handleCancel = () => {
    setIsButtonDisabled(true);
    setIsOpenModal(false);
    setParams((params) => {
      params.searchString = "";
      params.pageNumber = 1;
      return params;
    });
  };

  

  const handleSave = () => {
    handleCancel();
    setUserSelected(selectedUser as User);
  };

  return (
    <>
      <Modal
        title={
          <div>
            <p className="text-lg font-semibold primary-color">Select User</p>
          </div>
        }
        destroyOnClose={true}
        open={isOpen}
        closable={false}
        okText="Save"
        width={800}
        footer={[
          <Button
            key="save"
            className="text-[#E9424D] mr-2"
            disabled={isButtonDisabled}
            danger
            type="primary"
            onClick={handleSave}
          >
            Save
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <div className="my-2 flex justify-end">
          <SearchFieldComponent onSearch={onSearch} />
        </div>
        <Table
          rowSelection={{
            type: "radio",
            ...rowSelection,
          }}
          pagination={false}
          onChange={handleTableChange}
          rowKey={(record) => record.id}
          loading={isLoading}
          dataSource={queryData?.data?.result?.data}
          columns={columns}
        />
        <div className="my-4 flex justify-end">
          <CustomPagination
            totalItems={queryData?.data.result.total}
            pageSize={PAGE_SIZE}
            handleChange={handlePageChange}
            currentPageNumber={params.pageNumber}
          ></CustomPagination>
        </div>
      </Modal>
    </>
  );
}

export default ModalSelectUser;
