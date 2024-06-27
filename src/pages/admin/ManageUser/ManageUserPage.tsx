import SearchFieldComponent from "@/components/SearchFieldComponent/SearchFieldComponent";
import { User } from "@/types/User";
import { Button, Table, TableColumnsType, message } from "antd";
import { useSearchParams } from "react-router-dom";
import "./ManageUserPage.css";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import Filter from "@/components/FilterComponent/Filter";
import CustomPagination from "@/components/Pagination/CustomPagination";
import { useQuery } from "react-query";
import { UserAPICaller } from "@/services/apis/user.api";
import UserSearchParams from "@/types/UserSearchParams";
import { useEffect, useState } from "react";
import type { TableProps } from "antd/es/table";
import APIResponse from "@/types/APIResponse";
import { SorterResult } from "antd/es/table/interface";
import UserDetailsModal from "./components/UserDetailsModal";
import { useNavigate, useLocation } from "react-router-dom";

function ManageUserPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { newUser } = location.state || {};
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>();
  const [items, setItems] = useState<User[]>([]);

  const onSearch = (value: string) => {
    setSearchParams({ search: value });
  };

  const params: UserSearchParams = {
    searchString: searchParams.get("search") || "",
    type: searchParams.get("type") || "",
    orderBy: searchParams.get("orderBy") || undefined,
    sortDir: searchParams.get("sortDir") || undefined,
    pageNumber: Number(searchParams.get("page") || "1"),
    pageSize: Number("20"),
  };

  const {
    data: queryData,
    isSuccess,
    isError,
    isLoading,
    error,
  } = useQuery(["getAllUsers", { params }], () =>
    UserAPICaller.getSearchUser(params)
  );

  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
    }

    if (isSuccess) {
      let updatedItems = queryData.data.result.data;
      if (newUser) {
        updatedItems = updatedItems.filter(
          (item: User) => item.id !== newUser.id
        );
        updatedItems = [newUser, ...updatedItems];
        if (updatedItems.length === 18) {
          updatedItems.pop();
        }
      }
      window.history.replaceState({}, "");
      setItems(updatedItems);
    }
  }, [error, isError, isSuccess, queryData]);

  const baseUser: User = {
    id: 0,
    staffCode: "",
    firstName: "",
    lastName: "",
    username: "",
    joinDate: new Date(),
    dob: new Date(),
    gender: "",
    status: "",
    type: "",
    location: {
      id: 0,
      name: "",
    },
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
      title: "Name",
      dataIndex: "fullName",
      showSorterTooltip: true,
      sorter: true, // add API later
      render: (_text, record) => `${record.firstName} ${record.lastName}`,
      key: "Name",
    },
    {
      title: "Username",
      dataIndex: "username",
      showSorterTooltip: true,
      key: "username",
    },
    {
      title: "Joined Date",
      dataIndex: "joinDate",
      showSorterTooltip: true,
      sorter: true,
      key: "joinDate",
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
    {
      title: "",
      dataIndex: "action",
      render: () => (
        <div className="flex space-x-5">
          <EditOutlined
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <CloseCircleOutlined
            style={{ color: "red" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      ),
      key: "action",
    },
  ];

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

  const handleCreateUser = () => {
    navigate("/admin/users/createUser");
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-red-500">User List</h1>
      <div className="flex  pt-2 ">
        <div>
          <Filter
            title={"Type"}
            options={[
              { label: "Admin", value: "ADMIN" },
              { label: "Staff", value: "STAFF" },
            ]}
            paramName={"type"}
          />
        </div>
        <div className=" flex flex-1 justify-end space-x-5">
          <SearchFieldComponent onSearch={onSearch} />
          <Button
            danger
            type="primary"
            color="#CF2338"
            onClick={handleCreateUser}
          >
            Create new user
          </Button>
        </div>
      </div>
      <div className="pt-8">
        <Table
          columns={columns}
          pagination={false}
          loading={isLoading}
          dataSource={items}
          rowKey={(record) => record.id}
          onChange={handleTableChange}
          onRow={(_, index) => {
            return {
              onClick: (e) => {
                e.stopPropagation();
                setUserData(items[index || 0]);
                setShowModal(true);
              },
            };
          }}
        ></Table>
        <div className="pt-8 flex justify-end">
          <CustomPagination
            totalItems={queryData?.data.result.total}
          ></CustomPagination>
        </div>
      </div>
      <UserDetailsModal
        show={showModal}
        data={userData || baseUser}
        handleClose={() => {
          setShowModal(false);
        }}
      />
    </div>
  );
}

export default ManageUserPage;
