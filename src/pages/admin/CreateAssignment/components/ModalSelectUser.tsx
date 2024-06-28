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
import { useSearchParams } from "react-router-dom";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<User>();

  const params: UserSearchParams = {
    searchString: searchParams.get("search") || "",
    type: searchParams.get("type") || "",
    orderBy: searchParams.get("orderBy") || undefined,
    sortDir: searchParams.get("sortDir") || undefined,
    pageNumber: Number(searchParams.get("page") || "1"),
    pageSize: Number("20"),
  };

  // query
  const {
    data: queryData,
    isError,
    isLoading,
    error,
  } = useQuery(["getUserAssign", { params }], () =>
    UserAPICaller.getUserAssign(params)
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
    setSearchParams({ search: value });
  };

  const handleTableChange: TableProps<User>["onChange"] = (
    _pagination,
    _filteers,
    sorter
  ) => {
    sorter = sorter as SorterResult<User>;
    const { field, order } = sorter;

    const fieldString = field as string;
    setSearchParams((searchParams) => {
      searchParams.set("orderBy", fieldString);

      return searchParams;
    });
    if (order === "ascend") {
      setSearchParams((searchParams) => {
        searchParams.set("sortDir", "asc");

        return searchParams;
      });
    } else if (order === "descend") {
      setSearchParams((searchParams) => {
        searchParams.set("sortDir", "desc");

        return searchParams;
      });
    } else
      setSearchParams((searchParams) => {
        searchParams.delete("sortDir");
        searchParams.delete("orderBy");

        return searchParams;
      });
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
    setSearchParams((searchParams) => {
      searchParams.delete("search");
      searchParams.delete("type");
      searchParams.delete("orderBy");
      searchParams.delete("sortDir");
      searchParams.delete("page");
      searchParams.delete("pageSize");

      return searchParams;
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
          ></CustomPagination>
        </div>
      </Modal>
    </>
  );
}

export default ModalSelectUser;
