import DateFilter from "@/components/DateFilter/DateFilter";
import Filter from "@/components/FilterComponent/Filter";
import CustomPagination from "@/components/Pagination/CustomPagination";
import SearchFieldComponent from "@/components/SearchFieldComponent/SearchFieldComponent";
import { ReturningRequestAPICaller } from "@/services/apis/returning-request.api";
import APIResponse from "@/types/APIResponse";
import { ReturningRequest } from "@/types/ReturningRequest";
import ReturningRequestSearchParams from "@/types/ReturningRequestSearchParams";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Badge, Table, TableColumnsType, TableProps, message } from "antd";
import { SorterResult } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation, useSearchParams } from "react-router-dom";
import { Assignment } from "@/types/Assignment";
import { User } from "@/types/User";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";

const displayState = {
  COMPLETED: "Completed",
  WAITING_FOR_RETURNING: "Waiting for returning",
};

function ManageReturningRequestPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<ReturningRequest[]>([]);
  const onSearch = (value: string) => {
    setSearchParams({ search: value });
  };
  const location = useLocation();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number>(0);

  const [newReturningRequest, setNewReturningRequest] =
    useState<ReturningRequest>();

  const params: ReturningRequestSearchParams = {
    searchString: searchParams.get("search") || "",
    states: searchParams.get("states") || "",
    returnDate: searchParams.get("returnDate"),
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
  } = useQuery(["getAllReturningRequest", { params }], () =>
    ReturningRequestAPICaller.getSearchReturningRequests(params)
  );

  const {
    mutate,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
    error: errorDelete,
  } = useMutation(ReturningRequestAPICaller.cancelReturningRequest);

  useEffect(() => {
    if (isDeleteSuccess) {
      message.success("Returning request has been deleted successfully!");
      refetch();
      setIsOpenDeleteModal(false);
    }
    if (isDeleteError) {
      const errorResponse = (errorDelete as { response: { data: APIResponse } })
        .response?.data;
      message.error(errorResponse?.message);
    }
  }, [isDeleteSuccess, isDeleteError]);

  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response?.data;
      message.error(errorResponse?.message);
      setItems([]);
    }

    if (isSuccess) {
      let temp = [...queryData.data.result.data];
      if (newReturningRequest) {
        const ReturningRequestWithNew = { ...newReturningRequest, isNew: true };
        temp = temp.filter((item) => item.id !== newReturningRequest.id);

        temp = [ReturningRequestWithNew, ...temp];
        while (temp.length > 20) {
          temp.pop();
        }
        setNewReturningRequest(undefined);
      }
      window.history.replaceState({}, "");
      setItems(temp);
    }
  }, [error, isError, isSuccess, queryData]);

  useEffect(() => {
    if (location.state?.ReturningRequest) {
      const ReturningRequest = location.state
        .ReturningRequest as ReturningRequest;
      setNewReturningRequest(ReturningRequest);
    }
  }, []);

  const columns: TableColumnsType<ReturningRequest> = [
    {
      title: "No.",
      dataIndex: "id",
      sorter: true,
      key: "id",
    },
    {
      title: "Asset code",
      dataIndex: "assignment",
      sorter: true,
      key: "assetCode",
      render: (assignment: Assignment) => assignment.asset?.assetCode,
    },
    {
      title: "Asset name",
      dataIndex: "assignment",
      sorter: true,
      ellipsis: true,
      key: "assetName",
      render: (assignment: Assignment) => assignment.asset?.name,
    },
    {
      title: "Requested by",
      dataIndex: "requestedBy",
      sorter: true,
      key: "requestedBy",
      ellipsis: true,
      render: (user: User) => user?.username,
    },
    {
      title: "Assigned Date",
      dataIndex: "assignedDate",
      sorter: true,
      key: "assignedDate",
      render: (date: Date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Accepted By",
      dataIndex: "acceptedBy",
      sorter: true,
      key: "acceptedBy",
      render: (user: User) => user?.username,
    },
    {
      title: "Returned Date",
      dataIndex: "returnDate",
      sorter: true,
      key: "returnDate",
      render: (date: Date) => (date ? dayjs(date).format("DD/MM/YYYY") : ""),
    },
    {
      title: "State",
      dataIndex: "state",
      sorter: true,
      key: "state",
      render: (state: "WAITING_FOR_RETURNING" | "COMPLETED") =>
        displayState[state],
    },
    {
      title: "",
      dataIndex: "action",
      render: (_, record) => (
        <div className="flex space-x-5">
          <button
            disabled={record.state == "COMPLETED"}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={
              record.state == "COMPLETED"
                ? "cursor-not-allowed"
                : "hover:opacity-70 hover:text-red-600"
            }
          >
            <CheckOutlined
              data-testid=""
              style={{
                color: !(record.state == "COMPLETED") ? "red" : "pink",
              }}
            />
          </button>

          <button
            disabled={record.state == "COMPLETED"}
            onClick={(e) => {
              e.stopPropagation();
              setIdToDelete(record.id);
              setIsOpenDeleteModal(true);
            }}
            className={
              record.state == "COMPLETED"
                ? "cursor-not-allowed"
                : "hover:opacity-70 hover:text-red-600"
            }
          >
            <CloseOutlined
              data-testid=""
              style={{
                color: !(record.state == "COMPLETED") ? "black" : "gray",
              }}
            />
          </button>

          {record.isNew && <Badge count={"New"} />}
        </div>
      ),
      key: "action",
    },
  ];
  const handleTableChange: TableProps<ReturningRequest>["onChange"] = (
    _pagination,
    _filteers,
    sorter
  ) => {
    sorter = sorter as SorterResult<ReturningRequest>;
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
      <h1 className="text-3xl font-bold text-red-500">Request List</h1>
      <div className="flex  pt-2 ">
        <div className="flex space-x-3">
          <Filter
            title={"State"}
            options={[
              { label: "Completed", value: "COMPLETED" },
              { label: "Waiting for return", value: "WAITING_FOR_RETURNING" },
            ]}
            paramName={"states"}
          />
          <DateFilter paramName={"returnDate"} />
        </div>
        <div className=" flex flex-1 justify-end space-x-5">
          <SearchFieldComponent onSearch={onSearch} />
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
        />{" "}
      </div>
      <div className="pt-8 flex justify-end">
        <CustomPagination
          totalItems={queryData?.data.result.total}
        ></CustomPagination>
      </div>
      <ConfirmationModal
        isOpen={isOpenDeleteModal}
        title={<div className="text-[#cf2338]">Are you sure ?</div>}
        message="Do you want to cancel this returning request?"
        buttontext="Delete"
        onConfirm={() => {
          mutate(idToDelete);
        }}
        onCancel={() => {
          setIsOpenDeleteModal(false);
        }}
      />
    </div>
  );
}

export default ManageReturningRequestPage;
