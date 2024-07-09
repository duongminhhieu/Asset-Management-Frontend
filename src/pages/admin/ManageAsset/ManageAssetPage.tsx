import SearchFieldComponent from "@/components/SearchFieldComponent/SearchFieldComponent";
import { Button, Table, TableColumnsType, Badge, message } from "antd";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import Filter from "@/components/FilterComponent/Filter";
import CustomPagination from "@/components/Pagination/CustomPagination";
import { useMutation, useQuery } from "react-query";
import { useEffect, useState } from "react";
import type { TableProps } from "antd/es/table";
import APIResponse from "@/types/APIResponse";
import { SorterResult } from "antd/es/table/interface";
import { AssetResponse } from "@/types/Asset";
import AssetSearchParams from "@/types/AssetSearchParams";
import { AssetAPICaller } from "@/services/apis/asset.api";
import { Category } from "@/types/Category";
import { CategoryAPICaller } from "@/services/apis/category.api";
import AssetDetailsModal from "./components/AssetDetailsModal";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";
import NotificationModal from "@/components/NotificationModal/NotificationModal";

function ManageAssetPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState<AssetResponse[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [assetData, setAssetData] = useState<AssetResponse>();

  const location = useLocation();

  const { asset } = location.state || {};

  const [openNotificationModal, setOpenNotificationModal] = useState(false);

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const navigate = useNavigate();

  const onSearch = (value: string) => {
    setSearchParams((p) => {
      p.set("search", value);
      p.delete("page");
      return p;
    });
  };

  const [idAsset, setIdAsset] = useState<number>(0);

  const params: AssetSearchParams = {
    searchString: searchParams.get("search") || "",
    states: searchParams.get("states") || "",
    categoryIds: searchParams.get("category") || "",
    orderBy: searchParams.get("orderBy") || undefined,
    sortDir: searchParams.get("sortDir") || undefined,
    pageNumber: Number(searchParams.get("page") || "1"),
    pageSize: Number("20"),
  };

  // UseQuery For Asset

  const {
    data: queryData,
    isSuccess,
    isError,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery(["getAllAssets", { params }], () =>
    AssetAPICaller.getSearchAssets(params)
  );

  // UseQuery For Category

  const {
    data: categoryData,
    isLoading: isLoadingCategory,
    isSuccess: isSuccessCategory,
    isError: isErrorCategory,
    error: errorCategory,
  } = useQuery(["getAllCategory"], () => CategoryAPICaller.getAll());

  // UseQuery For History

  const {
    data: historyData,
    isSuccess: isSuccessHistory,
    isError: isErrorHistory,
    refetch: refetchHistory,
  } = useQuery(
    ["getHistoryAsset", { idAsset }],
    () => AssetAPICaller.getAssetHistory(idAsset),
    {
      enabled: false,
    }
  );

  //  useMutation For Delete Asset

  const {
    isSuccess: isSuccessDelete,
    isError: isErrorDelete,
    error: errorDelete,
    mutate: deleteMutate,
  } = useMutation(["deleteAsset", { idAsset }], () =>
    AssetAPICaller.deleteAsset(idAsset)
  );

  // useEffect for Category

  useEffect(() => {
    if (isErrorCategory) {
      const errorResponse = (
        errorCategory as { response: { data: APIResponse } }
      ).response.data;
      message.error(errorResponse.message);
    }
  }, [isErrorCategory, isSuccessCategory, categoryData, errorCategory]);

  // useEffect for Asset

  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
    }

    if (isSuccess) {
      let temp = [...queryData.data.result.data];
      if (asset) {
        temp = temp.filter((item: AssetResponse) => asset.id !== item.id);
        temp = [asset, ...temp];
        while (temp.length > 20) {
          temp.pop();
        }
      }
      const pageCount = Math.ceil(queryData?.data.result.total / 20);
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
      }
      window.history.replaceState({}, "");
      setItems(temp);
    }
  }, [error, isError, isSuccess, queryData]);

  // useEffect for Delete Asset

  useEffect(() => {
    if (isErrorDelete) {
      const errorResponse = (errorDelete as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
    }

    if (isSuccessDelete) {
      message.success("Delete asset successfully");
      refetch();
    }
  }, [isErrorDelete, isSuccessDelete, errorDelete]);

  //useEffect for History

  useEffect(() => {
    if (isSuccessHistory) {
      if (historyData.data.result == true) {
        setOpenNotificationModal(true);
      } else {
        setOpenConfirmationModal(true);
      }
    }
    // setEnable(false);
  }, [isSuccessHistory, isErrorHistory, historyData]);

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
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      showSorterTooltip: true,
      sorter: true,
      key: "category",
    },
    {
      key: "State",
      title: "State",
      dataIndex: "state",
      showSorterTooltip: true,
      sorter: true, // add API later
    },
    {
      title: "",
      dataIndex: "action",
      render: (_text, record) => (
        <div className="flex space-x-5">
          <button
            disabled={record.state == "ASSIGNED"}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/assets/edit-asset/${record.id}`);
            }}
            className={
              record.state == "ASSIGNED"
                ? "cursor-not-allowed"
                : "hover:opacity-70 hover:text-red-600"
            }
          >
            <EditOutlined
              data-testid="edit-assignment"
              style={{ color: record.state == "ASSIGNED" ? "gray" : "black" }}
            />
          </button>

          {/* <Button disabled={true}> */}
          <button
            disabled={record.state == "ASSIGNED"}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteButton(record.id);
            }}
          >
            <CloseCircleOutlined
              data-testid="delete-asset"
              style={{ color: record.state == "ASSIGNED" ? "black" : "red" }}
            />
          </button>
          {/* </Button> */}
          {asset && asset.id === record.id && <Badge count={"New"} />}
        </div>
      ),
      key: "action",
    },
  ];

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

  const handleDeleteButton = async (id: number) => {
    await setIdAsset(id);
    refetchHistory();
  };

  const handleDelete = () => {
    deleteMutate();
    setOpenConfirmationModal(false);
  };

  const baseAsset = {
    id: 1,
    name: "",
    specification: "",
    category: "",
    assetCode: "",
    installDate: new Date(),
    state: "",
    location: {
      id: 1,
      name: "Ho Chi Minh",
      code: "HCM",
    },
    EAssetSate: "",
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-red-500">Asset List</h1>
      <div className="flex  pt-2 ">
        <div className="flex space-x-3">
          <Filter
            title={"State"}
            options={[
              { label: "Assigned", value: "ASSIGNED" },
              { label: "Available", value: "AVAILABLE" },
              { label: "Not Available", value: "NOT_AVAILABLE" },
              { label: "Waiting for recycle", value: "WAITING_FOR_RECYCLE" },
              { label: "Recycled", value: "RECYCLED" },
            ]}
            paramName={"states"}
            allowedMultiple={true}
          />
          <Filter
            title={"Category"}
            options={
              categoryData?.data?.result.map((category: Category) => ({
                label: category.name,
                value: category.id,
              })) || []
            }
            paramName={"category"}
            allowedMultiple={true}
          />
        </div>
        <div className=" flex flex-1 justify-end space-x-5">
          <SearchFieldComponent onSearch={onSearch} />
          <Button
            danger
            type="primary"
            color="#CF2338"
            onClick={() => navigate("create-asset")}
          >
            Create new asset
          </Button>
        </div>
      </div>
      <div className="pt-8">
        <Table
          columns={columns}
          pagination={false}
          rowKey={(record) => record.id}
          onChange={handleTableChange}
          loading={isLoading && isLoadingCategory}
          dataSource={items}
          rowClassName={"cursor-pointer"}
          onRow={(_, index) => {
            return {
              onClick: (e) => {
                e.stopPropagation();
                setAssetData(items[index || 0]);
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
      <AssetDetailsModal
        assetData={assetData || baseAsset}
        show={showModal}
        handleClose={() => {
          setShowModal(false);
        }}
      />
      <ConfirmationModal
        isOpen={openConfirmationModal}
        title={<p className="text-[#e9424d]">Are you sure?</p>}
        message={<p>Do you want to delete thist asset?</p>}
        onCancel={() => setOpenConfirmationModal(false)}
        buttontext="Delete"
        onConfirm={() => {
          handleDelete();
        }}
      />
      <NotificationModal
        isOpen={openNotificationModal}
        title={<p className="text-[#e9424d]">Cannot Delete Asset</p>}
        message={
          <p>
            Cannot delete the asset because it belongs to one or more historical
            assignments. If the asset is not able to be used anymore, please
            update its state in <NavLink to={"/abc"}>Edit Asset Page</NavLink>
          </p>
        }
        onCancel={() => setOpenNotificationModal(false)}
      />
    </div>
  );
}

export default ManageAssetPage;
