import CustomPagination from "@/components/Pagination/CustomPagination";
import { ReportAPICaller } from "@/services/apis/report.api";
import APIResponse from "@/types/APIResponse";
import { Report, ReportSearchParams } from "@/types/Report";
import { Button, Table, TableColumnsType, TableProps, message } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

const PAGE_SIZE = 20;

function ReportPage() {
  // state
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Report[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const params: ReportSearchParams = {
    sortBy: searchParams.get("sortBy") || undefined,
    sortDir: searchParams.get("sortDir") || undefined,
    pageNumber: Number(searchParams.get("page") || "1"),
    pageSize: PAGE_SIZE,
  };

  // query
  const {
    data: queryData,
    isSuccess,
    isError,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery(["getReportsList", { params }], () =>
    ReportAPICaller.getReport(params)
  );

  const { isLoading: exportLoading, refetch: refetchExport } = useQuery(
    ["exportReport"],
    () => ReportAPICaller.exportReport(),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess(data) {
        const blob = new Blob([data?.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report_${dayjs(Date.now()).format("YYYY-MM-DD")}.xlsx`;
        a.click();
      },
      onError(error) {
        const errorResponse = (error as { response: { data: APIResponse } })
          .response?.data;
        message.error(errorResponse?.message);
      },
    }
  );

  // effect
  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response?.data;
      message.error(errorResponse?.message);
      setItems([]);
    }

    if (isSuccess) {
      const pageCount = Math.ceil(queryData?.data.result.total / PAGE_SIZE);
      const currentPage = Number(searchParams.get("page")) || 1;
      if (
        pageCount < currentPage &&
        searchParams.get("page") !== "1" &&
        !isFetching
      ) {
        setSearchParams((p) => {
          p.set("page", pageCount === 0 ? "1" : pageCount.toString());
          return p;
        });
        refetch();
      }
      window.history.replaceState({}, "");
      setItems(queryData.data.result.data);
    }
  }, [error, isError, isSuccess, queryData]);

  // handlers
  const columns: TableColumnsType<Report> = [
    {
      title: "Category",
      dataIndex: "categoryName",
      sorter: true,
      key: "categoryName",
    },
    {
      title: "Total",
      dataIndex: "total",
      sorter: true,
      key: "total",
    },
    {
      title: "Assigned",
      dataIndex: "assignedCount",
      sorter: true,
      key: "assignedCount",
    },
    {
      title: "Available",
      dataIndex: "availableCount",
      sorter: true,
      key: "availableCount",
    },
    {
      title: "Not Available",
      dataIndex: "notAvailableCount",
      sorter: true,
      key: "notAvailableCount",
    },
    {
      title: "Waiting For Recycle",
      dataIndex: "waitingForRecycleCount",
      sorter: true,
      key: "waitingForRecycleCount",
    },
    {
      title: "Recycled",
      dataIndex: "recycledCount",
      sorter: true,
      key: "recycledCount",
    },
  ];

  const handleTableChange: TableProps<Report>["onChange"] = (
    _pagination,
    _filteers,
    sorter
  ) => {
    sorter = sorter as SorterResult<Report>;
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
    <>
      <div>
        <h1 className="text-3xl font-bold text-red-500">Report</h1>
        <div className="flex  pt-2 ">
          <div className=" flex flex-1 justify-end space-x-5">
            <Button
              danger
              type="primary"
              className="text-[#cf2338]"
              color="#cf2338"
              loading={exportLoading}
              onClick={() => {
                refetchExport();
              }}
            >
              Export
            </Button>
          </div>
        </div>
        <div className="pt-8">
          <Table
            columns={columns}
            dataSource={items}
            loading={isLoading}
            pagination={false}
            onChange={handleTableChange}
            rowKey={(record) => record.categoryId}
          />{" "}
        </div>
        <div className="pt-8 flex justify-end">
          <CustomPagination
            totalItems={queryData?.data?.result?.total || 0}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>
    </>
  );
}

export default ReportPage;
