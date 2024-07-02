import { Table, TableColumnsType, message } from "antd";
import { useSearchParams } from "react-router-dom";
import "./Home.css";
import {
  ReloadOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import CustomPagination from "@/components/Pagination/CustomPagination";
import { AssignmentAPICaller } from "@/services/apis/assignment.api";
import AssignmentParams from "@/types/AssignmentParams";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import type { TableProps } from "antd/es/table";
import APIResponse from "@/types/APIResponse";
import { SorterResult } from "antd/es/table/interface";
import { AssignmentResponse } from "@/types/AssignmentResponse";
import AssignmentDetailsModal from "./components/AssignmentDetailsModal";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";
import { AssignmentState } from "@/enums/AssignmentState.enum";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [assignmentData, setAssignmentData] = useState<AssignmentResponse>();
  const [items, setItems] = useState<AssignmentResponse[]>([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | (() => void)>(null);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalButtonText, setModalButtonText] = useState<string>("");

  const params: AssignmentParams = {
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
  } = useQuery(["getAllAssignments", { params }], () =>
    AssignmentAPICaller.getMyAssignments(params)
  );

  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
    }

    if (isSuccess) {
      setItems(queryData?.data.result.data || []);
    }
  }, [error, isError, isSuccess, queryData]);

  const baseAssignment: AssignmentResponse = {
    id: 0,
    assignedDate: new Date(),
    note: "",
    assignTo: "",
    assignBy: "",
    asset: {
      id: 0,
      name: "",
      assetCode: "",
      location: {
        id: 0,
        name: "",
        code: "",
      },
      category: "",
      installDate: new Date(),
      EAssetSate: "",
      specification: "",
      state: "",
    },
    state: "",
    returnDate: null,
  };

  const handleAcceptAssignment = (assignmentId: number) => {
    AssignmentAPICaller.changeState(assignmentId, AssignmentState.ACCEPTED)
      .then(() => {
        setOpenConfirmationModal(false);
        refetch();
      })
      .catch((error) => {
        message.error("Failed to accept assignment: " + error.message);
      });
  };

  const handleDeclineAssignment = (assignmentId: number) => {
    AssignmentAPICaller.changeState(assignmentId, AssignmentState.DECLINED)
      .then(() => {
        setOpenConfirmationModal(false);
        refetch();
      })
      .catch((error) => {
        message.error("Failed to accept assignment: " + error.message);
      });
  };

  const columns: TableColumnsType<AssignmentResponse> = [
    {
      title: "Asset Code",
      dataIndex: ["asset", "assetCode"],
      showSorterTooltip: true,
      sorter: true,
      key: "assetCode",
    },
    {
      title: "Asset Name",
      dataIndex: ["asset", "name"],
      showSorterTooltip: true,
      sorter: true,
      key: "assetName",
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: ["asset", "category"],
      showSorterTooltip: true,
      sorter: true,
      key: "category",
    },
    {
      title: "Assigned Date",
      dataIndex: "assignedDate",
      showSorterTooltip: true,
      sorter: true,
      key: "assignedDate",
    },
    {
      key: "state",
      title: "State",
      dataIndex: "state",
      showSorterTooltip: true,
      sorter: true,
      render: (state: string) => {
        if (state === "WAITING") return "Waiting for acceptance";
        if (state === "ACCEPTED") return "Accepted";
        return "Declined";
      },
    },
    {
      title: "",
      dataIndex: "action",
      render: (_, record) => (
        <div className="flex space-x-5" data-testId="action">
          {record.state === "WAITING" ? (
            <>
              <button aria-label="accepted">
                <CheckOutlined
                  aria-label="accepted"
                  style={{ color: "red" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalMessage("Do you want to accept this assignment?");
                    setModalButtonText("Accept");
                    setOpenConfirmationModal(true);
                    setConfirmAction(
                      () => () => handleAcceptAssignment(record.id)
                    );
                  }}
                />
              </button>
              <button aria-label="declined">
                <CloseOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalMessage("Do you want to decline this assignment?");
                    setModalButtonText("Decline");
                    setOpenConfirmationModal(true);
                    setConfirmAction(
                      () => () => handleDeclineAssignment(record.id)
                    );
                  }}
                />
              </button>
            </>
          ) : (
            <>
              <CheckOutlined style={{ color: "gray" }} disabled />
              <CloseOutlined style={{ color: "gray" }} disabled />
            </>
          )}
          <ReloadOutlined
            style={{ color: "blue" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      key: "action",
    },
  ];

  const fieldToQueryParamMap: Record<string, string> = {
    "asset.assetCode": "assetCode",
    "asset.name": "assetName",
    "asset.category": "category",
    assignedDate: "assignedDate",
    state: "state",
  };

  const handleTableChange: TableProps<AssignmentResponse>["onChange"] = (
    _pagination,
    _filters,
    sorter
  ) => {
    sorter = sorter as SorterResult<AssignmentResponse>;
    const { field, order } = sorter;

    // Convert nested path array to dot-separated string
    const fieldString = Array.isArray(field)
      ? field.join(".")
      : (field as string);

    // Use the mapping to get the correct query parameter
    const queryParam = fieldToQueryParamMap[fieldString] || fieldString;

    setSearchParams((searchParams) => {
      searchParams.set("orderBy", queryParam);

      if (order === "ascend") {
        searchParams.set("sortDir", "asc");
      } else if (order === "descend") {
        searchParams.set("sortDir", "desc");
      } else {
        searchParams.delete("sortDir");
        searchParams.delete("orderBy");
      }

      return searchParams;
    });
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-red-500">My Assignment</h1>
      <div className="pt-8">
        <Table
          columns={columns}
          pagination={false}
          loading={isLoading}
          dataSource={items}
          rowClassName={"cursor-pointer"}
          rowKey={(record) => record.id}
          onChange={handleTableChange}
          onRow={(_, index) => {
            return {
              onClick: (e) => {
                e.stopPropagation();
                setAssignmentData(items[index || 0]);
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
      <AssignmentDetailsModal
        show={showModal}
        data={assignmentData || baseAssignment}
        handleClose={() => {
          setShowModal(false);
        }}
      />
      <ConfirmationModal
        isOpen={openConfirmationModal}
        title={<p className="text-[#e9424d]">Are you sure?</p>}
        message={<p>{modalMessage}</p>}
        onCancel={() => setOpenConfirmationModal(false)}
        buttontext={modalButtonText}
        onConfirm={confirmAction || (() => {})}
      />
    </div>
  );
}

export default Home;