import DateFilter from "@/components/DateFilter/DateFilter";
import Filter from "@/components/FilterComponent/Filter";
import CustomPagination from "@/components/Pagination/CustomPagination";
import SearchFieldComponent from "@/components/SearchFieldComponent/SearchFieldComponent";
import { AssignmentAPICaller } from "@/services/apis/assignment.api";
import APIResponse from "@/types/APIResponse";
import { Asset } from "@/types/Asset";
import { AssignmentResponse } from "@/types/AssignmentResponse";
import AssignmentSearchParams from "@/types/AssignmentSearchParams";
import {
  CloseCircleOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Table, TableColumnsType, TableProps, message } from "antd";
import { SorterResult } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

function ManageAssignmentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<AssignmentResponse[]>([]);
  const navigate = useNavigate();
  const onSearch = (value: string) => {
    setSearchParams({ search: value });
  };
  const location = useLocation();

  const { assignment } = location.state || {};

  const params: AssignmentSearchParams = {
    searchString: searchParams.get("search") || "",
    states: searchParams.get("states") || "",
    assignDate: searchParams.get("assignedDate"),
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
  } = useQuery(["getAllAssets", { params }], () =>
    AssignmentAPICaller.getSearchAssignments(params)
  );

  const displayState = {
    ACCEPTED: "Accepted",
    WAITING: "Waiting for acceptance",
    DECLINED: "Declined",
  };

  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response?.data;
      message.error(errorResponse?.message);
      setItems([]);
    }

    if (isSuccess) {
      let temp = [...queryData.data.result.data];
      if (assignment) {
        temp = temp.filter((item) => item.id !== assignment.id);

        temp = [assignment, ...temp];
        while (temp.length > 20) {
          temp.pop();
        }
      }
      window.history.replaceState({}, "");
      setItems(temp);
    }
    return () => message.destroy("abc");
  }, [error, isError, isSuccess, queryData]);

  const columns: TableColumnsType<AssignmentResponse> = [
    {
      title: "No.",
      dataIndex: "id",
      sorter: true,
      key: "id",
    },
    {
      title: "Asset code",
      dataIndex: "asset",
      sorter: true,
      key: "assetCode",
      render: (asset: Asset) => asset.assetCode,
    },
    {
      title: "Asset name",
      dataIndex: "asset",
      sorter: true,
      ellipsis: true,
      key: "assetName",
      render: (asset: Asset) => asset.name,
    },
    {
      title: "Assigned To",
      dataIndex: "assignTo",
      sorter: true,
      key: "assignedTo",
      ellipsis: true,
    },
    {
      title: "Assigned By",
      dataIndex: "assignBy",
      sorter: true,
      key: "assignedBy",
    },
    {
      title: "Assigned Date",
      dataIndex: "assignedDate",
      sorter: true,
      key: "assignedTo",
      render: (date: Date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "State",
      dataIndex: "state",
      sorter: true,
      key: "state",
      render: (state: "ACCEPTED" | "DECLINED" | "WAITING") =>
        displayState[state],
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
          <ReloadOutlined style={{ color: "blue" }} />
        </div>
      ),
      key: "action",
    },
  ];
  const handleTableChange: TableProps<AssignmentResponse>["onChange"] = (
    _pagination,
    _filteers,
    sorter
  ) => {
    sorter = sorter as SorterResult<AssignmentResponse>;
    const { field, order } = sorter;
    const fieldString = sorter.columnKey?.toString() || (field as string);
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
    <div>
      <h1 className="text-3xl font-bold text-red-500">Assignment List</h1>
      <div className="flex  pt-2 ">
        <div className="flex space-x-3">
          <Filter
            title={"State"}
            options={[
              { label: "Accepted", value: "ACCEPTED" },
              { label: "Waiting for acceptance", value: "WAITING" },
            ]}
            paramName={"states"}
          />
          <DateFilter paramName={"assignedDate"} />
        </div>
        <div className=" flex flex-1 justify-end space-x-5">
          <SearchFieldComponent onSearch={onSearch} />
          <Button
            danger
            type="primary"
            color="#CF2338"
            onClick={() => navigate("create-assignment")}
          >
            Create new assignment
          </Button>
        </div>
      </div>
      <div className="pt-8">
        <Table
          columns={columns}
          dataSource={items}
          loading={isLoading}
          onChange={handleTableChange}
          pagination={false}
          rowKey={(record) => record.id}
        />{" "}
      </div>
      <div className="pt-8 flex justify-end">
        <CustomPagination
          totalItems={queryData?.data.result.total}
        ></CustomPagination>
      </div>
    </div>
  );
}

export default ManageAssignmentPage;
