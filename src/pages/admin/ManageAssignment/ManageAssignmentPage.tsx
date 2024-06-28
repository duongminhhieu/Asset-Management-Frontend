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
import {
  Badge,
  Button,
  Table,
  TableColumnsType,
  TableProps,
  message,
} from "antd";
import { SorterResult } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import AssignmenDetailsModal from "./components/AssignmentDetailsModal";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";

function ManageAssignmentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<AssignmentResponse[]>([]);
  const navigate = useNavigate();
  const onSearch = (value: string) => {
    setSearchParams({ search: value });
  };
  const location = useLocation();
  const [isOpenDeleteAssignmentModal, setIsOpenDeleteAssignmentModal] =
    useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number>(0);

  const { assignment } = location.state || {};

  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

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
    refetch,
  } = useQuery(["getAllAssignment", { params }], () =>
    AssignmentAPICaller.getSearchAssignments(params)
  );

  const {
    mutate,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
    error: errorDelete,
  } = useMutation(AssignmentAPICaller.deleteAssignment);

  const displayState = {
    ACCEPTED: "Accepted",
    WAITING: "Waiting for acceptance",
    DECLINED: "Declined",
  };

  const [assignmentData, setAssignmentData] = useState<AssignmentResponse>();

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
        const newAssignment = { ...assignment, isNew: true };
        temp = temp.filter((item) => item.id !== assignment.id);

        temp = [newAssignment, ...temp];
        while (temp.length > 20) {
          temp.pop();
        }
      }
      window.history.replaceState({}, "");
      setItems(temp);
    }
  }, [error, isError, isSuccess, queryData]);

  useEffect(() => {
    if (isDeleteSuccess) {
      message.success("Assignment deleted successfully");
      refetch();
      setIsOpenDeleteAssignmentModal(false);
    }
    if (isDeleteError) {
      const errorResponse = (errorDelete as { response: { data: APIResponse } })
        .response?.data;
      message.error(errorResponse?.message);
    }
  }, [isDeleteSuccess, isDeleteError]);

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
      key: "assignedDate",
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
      render: (_, record) => (
        <div className="flex space-x-5">
          <button
            disabled={!(record.state == "WAITING")}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/assignments/edit-assignment/${record.id}`);
            }}
            className={
              !(record.state == "WAITING")
                ? "cursor-not-allowed"
                : "hover:opacity-70 hover:text-red-600"
            }
          >
            <EditOutlined
              data-testid="edit-assignment"
              style={{ color: !(record.state == "WAITING") ? "gray" : "black" }}
            />
          </button>

          <button
            disabled={record.state == "ACCEPTED"}
            onClick={(e) => {
              e.stopPropagation();
              setIdToDelete(record.id);
              setIsOpenDeleteAssignmentModal(true);
            }}
            className={
              record.state == "ACCEPTED"
                ? "cursor-not-allowed"
                : "hover:opacity-70 hover:text-red-600"
            }
          >
            <CloseCircleOutlined
              data-testid="delete-assignment"
              style={{ color: record.state == "ACCEPTED" ? "black" : "red" }}
            />
          </button>

          <ReloadOutlined style={{ color: "blue" }} />

          {record.isNew && <Badge count={"New"} />}
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
          rowClassName={"cursor-pointer"}
          onRow={(_, index) => {
            return {
              onClick: (e) => {
                e.stopPropagation();
                setAssignmentData(items[index || 0]);
                setShowDetailModal(true);
              },
            };
          }}
        />{" "}
      </div>
      <AssignmenDetailsModal
        data={assignmentData}
        show={showDetailModal}
        handleClose={() => setShowDetailModal(false)}
      />
      <div className="pt-8 flex justify-end">
        <CustomPagination
          totalItems={queryData?.data.result.total}
        ></CustomPagination>
      </div>

      <ConfirmationModal
        isOpen={isOpenDeleteAssignmentModal}
        title={<div className="text-[#cf2338]">Are you sure ?</div>}
        message="Do you want to delete this assignment?"
        buttontext="Delete"
        onConfirm={() => {
          mutate(idToDelete);
        }}
        onCancel={() => {
          setIsOpenDeleteAssignmentModal(false);
        }}
      />
    </div>
  );
}

export default ManageAssignmentPage;
