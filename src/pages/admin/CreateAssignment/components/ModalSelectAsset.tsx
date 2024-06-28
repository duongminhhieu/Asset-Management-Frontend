import CustomPagination from "@/components/Pagination/CustomPagination";
import SearchFieldComponent from "@/components/SearchFieldComponent/SearchFieldComponent";
import { AssetAPICaller } from "@/services/apis/asset.api";
import APIResponse from "@/types/APIResponse";
import { AssetResponse } from "@/types/Asset";
import AssetSearchParams from "@/types/AssetSearchParams";
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

function ModalSelectAsset({
  isOpen,
  setIsOpenModal,
  setAsset,
}: {
  isOpen: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
  setAsset: (asset: AssetResponse) => void;
}) {
  // state
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedAsset, setSelectedAsset] = useState<AssetResponse>();

  const params: AssetSearchParams = {
    searchString: searchParams.get("search") || "",
    states: "AVAILABLE",
    categoryIds: searchParams.get("category") || "",
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
  } = useQuery(["getAllAssets", { params }], () =>
    AssetAPICaller.getSearchAssets(params)
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

  const handleTableChange: TableProps<AssetResponse>["onChange"] = (
    _pagination,
    _filteers,
    sorter
  ) => {
    sorter = sorter as SorterResult<AssetResponse>;
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

  const columns: TableColumnsType<AssetResponse> = [
    {
      title: "Asset Code",
      dataIndex: "assetCode",
      showSorterTooltip: true,
      sorter: true, // add API later
      key: "assetCode",
    },
    {
      title: "Asset Name",
      dataIndex: "name",
      showSorterTooltip: true,
      sorter: true, // add API later
      key: "Name",
    },
    {
      title: "Category",
      dataIndex: "category",
      showSorterTooltip: true,
      sorter: true,
      key: "category",
    },
  ];

  const rowSelection = {
    onChange: (
      _selectedRowKeys: React.Key[],
      selectedRows: AssetResponse[]
    ) => {
      setIsButtonDisabled(false);
      setSelectedAsset(selectedRows[0]);
    },
    getCheckboxProps: (record: AssetResponse) => ({
      name: record.name,
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
    setAsset(selectedAsset as AssetResponse);
  };

  return (
    <>
      <Modal
        title={
          <div>
            <p className="text-lg font-semibold primary-color">Select Asset</p>
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

export default ModalSelectAsset;
