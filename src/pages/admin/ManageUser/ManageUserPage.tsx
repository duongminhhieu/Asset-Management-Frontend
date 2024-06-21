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

function ManageUserPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState<User[]>([]);

  const onSearch = (value: string) => {
    setSearchParams((searchParams) => {
      searchParams.set("search", value);

      return searchParams;
    });
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
      // console.log("error:", errorResponse);
      message.error(errorResponse.message);
    }

    if (isSuccess) {
      console.log("data 1:", queryData.data.result.data);

      setItems(queryData.data.result.data);
    }
  }, [isError, isSuccess, queryData]);

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
            onClick={() => {
              console.log("edit");
            }}
          />
          <CloseCircleOutlined
            style={{ color: "red" }}
            onClick={() => {
              console.log("Delete");
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

    console.log("sorter: ", field, order, sorter);
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

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-red-500">User List</h1>
      <div className="flex  pt-2 ">
        <div>
          <Filter
            title={"Type"}
            options={["ADMIN", "STAFF"]}
            paramName={"type"}
          />
        </div>
        <div className=" flex flex-1 justify-end space-x-5">
          <SearchFieldComponent onSearch={onSearch} />
          <Button danger type="primary" color="#CF2338" htmlType="submit">
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
        ></Table>
        <div className="pt-8 flex justify-end">
          <CustomPagination
            totalItems={queryData?.data.result.data.length}
          ></CustomPagination>
        </div>
      </div>
    </div>
  );
}

export default ManageUserPage;
