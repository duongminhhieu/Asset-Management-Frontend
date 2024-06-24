import SearchFieldComponent from "@/components/SearchFieldComponent/SearchFieldComponent";
import { Button, Table, TableColumnsType, message } from "antd";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import Filter from "@/components/FilterComponent/Filter";
import CustomPagination from "@/components/Pagination/CustomPagination";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import type { TableProps } from "antd/es/table";
import APIResponse from "@/types/APIResponse";
import { SorterResult } from "antd/es/table/interface";
import { Asset } from "@/types/Asset";
import AssetSearchParams from "@/types/AssetSearchParams";
import { AssetAPICaller } from "@/services/apis/asset.api";
import { Category } from "@/types/Category";
import { CategoryAPICaller } from "@/services/apis/category.api";

function ManageAssetPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState<Asset[]>([]);

  const location = useLocation();

  const { asset } = location.state || {};

  const navigate = useNavigate();

  const onSearch = (value: string) => {
    setSearchParams((searchParams) => {
      searchParams.set("search", value);

      return searchParams;
    });
  };

  const params: AssetSearchParams = {
    searchString: searchParams.get("search") || "",
    states: searchParams.get("states") || "",
    categoryIds: searchParams.get("category") || "",
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
    AssetAPICaller.getSearchAssets(params)
  );

  const {
    data: categoryData,
    isLoading: isLoadingCategory,
    isSuccess: isSuccessCategory,
    isError: isErrorCategory,
    error: errorCategory,
  } = useQuery(["getAllCategory"], () => CategoryAPICaller.getAll());

  useEffect(() => {
    if (isErrorCategory) {
      const errorResponse = (
        errorCategory as { response: { data: APIResponse } }
      ).response.data;
      // console.log("error:", errorResponse);
      message.error(errorResponse.message);
    }

    if (isSuccessCategory) {
      console.log("data 2:", categoryData?.data?.result);

      //   setCategory(categoryData.data.result.data);
    }
  }, [isErrorCategory, isSuccessCategory, categoryData, errorCategory]);

  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      // console.log("error:", errorResponse);
      message.error(errorResponse.message);
    }

    if (isSuccess) {
      console.log("data 1:", queryData.data.result);

      let temp = [...queryData.data.result.data];

      console.log("newAsset:", asset);

      if (asset) {
        temp = temp.filter((item: Asset) => asset.id !== item.id);
        console.log("first");
        temp.pop();
        temp = [asset, ...temp];
        const msg = { content: "some error msg", duration: 5, key: "abc" };
        message.success(msg);
        navigate(location.pathname, { state: {}, replace: true });
      }

      setItems(temp);
      return () => message.destroy("abc");
    }
  }, [isSuccess]);

  const columns: TableColumnsType<Asset> = [
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

  const handleTableChange: TableProps<Asset>["onChange"] = (
    _pagination,
    _filteers,
    sorter
  ) => {
    sorter = sorter as SorterResult<Asset>;
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
        ></Table>
        <div className="pt-8 flex justify-end">
          <CustomPagination totalItems={20}></CustomPagination>
        </div>
      </div>
    </div>
  );
}

export default ManageAssetPage;
