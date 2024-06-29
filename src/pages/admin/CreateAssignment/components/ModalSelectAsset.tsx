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

const PAGE_SIZE = 10;

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
  const [selectedAsset, setSelectedAsset] = useState<AssetResponse>();
  const [params, setParams] = useState<AssetSearchParams>({
    searchString: "",
    states: "AVAILABLE",
    categoryIds: "",
    orderBy: undefined,
    sortDir: undefined,
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
    ["getAllAssets", { params }],
    () => AssetAPICaller.getSearchAssets(params),
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

  const handleTableChange: TableProps<AssetResponse>["onChange"] = (
    _pagination,
    _filteers,
    sorter
  ) => {
    sorter = sorter as SorterResult<AssetResponse>;
    const { field, order } = sorter;

    const fieldString = field as string;
    setParams((params) => {
      params.orderBy = fieldString;
      params.sortDir = order === "ascend" ? "asc" : "desc";
      return params;
    });

    refetch();
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
  
  const handlePageChange = (page : number) =>{
    setParams({
      searchString: "",
      states: "AVAILABLE",
      categoryIds: "",
      orderBy: undefined,
      sortDir: undefined,
      pageNumber: page,
      pageSize: PAGE_SIZE,
    });
    refetch();
  }

  const handleCancel = () => {
    setIsButtonDisabled(true);
    setIsOpenModal(false);
    setParams({
      searchString: "",
      states: "AVAILABLE",
      categoryIds: "",
      orderBy: undefined,
      sortDir: undefined,
      pageNumber: 1,
      pageSize: PAGE_SIZE,
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
            pageSize={PAGE_SIZE}
            handleChange={handlePageChange}
            currentPageNumber={params.pageNumber}
          ></CustomPagination>
        </div>
      </Modal>
    </>
  );
}

export default ModalSelectAsset;
