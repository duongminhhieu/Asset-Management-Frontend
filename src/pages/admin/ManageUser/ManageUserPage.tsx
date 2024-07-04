import SearchFieldComponent from "@/components/SearchFieldComponent/SearchFieldComponent";
import { User } from "@/types/User";
import { Button, Table, TableColumnsType, message } from "antd";
import { useSearchParams } from "react-router-dom";
import "./ManageUserPage.css";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import Filter from "@/components/FilterComponent/Filter";
import CustomPagination from "@/components/Pagination/CustomPagination";
import { useMutation, useQuery } from "react-query";
import { UserAPICaller } from "@/services/apis/user.api";
import UserSearchParams from "@/types/UserSearchParams";
import { useEffect, useState } from "react";
import type { TableProps } from "antd/es/table";
import APIResponse from "@/types/APIResponse";
import { SorterResult } from "antd/es/table/interface";
import UserDetailsModal from "./components/UserDetailsModal";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationModal from "@/components/NotificationModal/NotificationModal";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";
function ManageUserPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { newUser } = location.state || {};
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>();
  const [items, setItems] = useState<User[]>([]);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openNotiModal, setOpenNotiModal] = useState(false);
  const [userDeleteId, setUserDeleteId] = useState<number>(0);

  const onSearch = (value: string) => {
    setSearchParams((p)=>{
      p.set("search", value)
      p.delete("page")
      return p
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
    isFetching,
    error,
    refetch
  } = useQuery(["getAllUsers", { params }], () =>
    UserAPICaller.getSearchUser(params)
  );

  const {
    data: validAssignData,
    isSuccess: isSuccessValidAssign,
    isError: isErrorValidAssign,
    refetch: refetchValidAssign,
  } = useQuery(
    ["getHistoryAsset", { userDeleteId }],
    () => UserAPICaller.checkValidAssignment(userDeleteId),
    {
      enabled: false,
    }
  );

  const {
    isSuccess: isSuccessDelete,
    isError: isErrorDelete,
    error: errorDelete,
    mutate: deleteMutate,
  } = useMutation(["deleteAsset", { userDeleteId }], () =>
    UserAPICaller.deleteUser(userDeleteId)
  );

  useEffect(()=>{
    if(isSuccessValidAssign){
      if (validAssignData.data.result === true){
        setOpenNotiModal(true)
      } else {
        setOpenConfirmModal(true)
      }
    }
  },[isSuccessValidAssign, isErrorValidAssign, validAssignData])

  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
    }

    if (isSuccess) {
      let updatedItems = queryData.data.result.data;
      if (newUser) {
        updatedItems = updatedItems.filter(
          (item: User) => item.id !== newUser.id
        );
        updatedItems = [newUser, ...updatedItems];
        while (updatedItems.length > 20) {
          updatedItems.pop();
        }
      }
      const pageCount = Math.ceil(queryData?.data.result.total/20);
      const currentPage = Number(searchParams.get("page")) || 1;
      if (pageCount<currentPage && searchParams.get("page") !== "1" && !isFetching) {
        setSearchParams((p)=>{
          p.set("page", pageCount===0?"1":pageCount.toString())
          return p;
        })
        refetch();
      }
      window.history.replaceState({}, "");
      setItems(updatedItems);
    }
  }, [error, isError, isSuccess, queryData]);

  useEffect(() => {
    if (isErrorDelete) {
      const errorResponse = (errorDelete as { response: { data: APIResponse } })
        .response.data;
      message.error(errorResponse.message);
    }

    if (isSuccessDelete) {
      message.success("Disable user successfully");
      refetch();
    }
  }, [isErrorDelete, isSuccessDelete, errorDelete]);


  const baseUser: User = {
    id: 0,
    staffCode: "",
    firstName: "",
    lastName: "",
    username: "",
    joinDate: new Date(),
    dob: new Date(),
    gender: "",
    status: "",
    type: "",
    location: {
      id: 0,
      name: "",
    },
  };

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
      ellipsis: true,
    },
    {
      title: "Username",
      dataIndex: "username",
      showSorterTooltip: true,
      key: "username",
      ellipsis: true,
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
      sorter: true,
      ellipsis: true, // add API later
      render: (_text, record) => {
        return record.type === "ADMIN" ? "Admin" : "Staff";
      },
    },
    {
      title: "",
      dataIndex: "action",
      render: (_, record) => (
        <div className="flex space-x-5">
          <EditOutlined
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <CloseCircleOutlined
            style={{ color: "red" }}
            onClick={async (e) => {
              e.stopPropagation();
              await setUserDeleteId(record.id)
              refetchValidAssign();
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

  const handleCreateUser = () => {
    navigate("/admin/users/createUser");
  };

  function handleDelete() {
    deleteMutate();
    setOpenConfirmModal(false);
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-red-500">User List</h1>
      <div className="flex  pt-2 ">
        <div>
          <Filter
            title={"Type"}
            options={[
              { label: "Admin", value: "ADMIN" },
              { label: "Staff", value: "STAFF" },
            ]}
            paramName={"type"}
          />
        </div>
        <div className=" flex flex-1 justify-end space-x-5">
          <SearchFieldComponent onSearch={onSearch} />
          <Button
            danger
            type="primary"
            color="#CF2338"
            onClick={handleCreateUser}
          >
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
          rowClassName={"cursor-pointer"}
          onChange={handleTableChange}
          onRow={(_, index) => {
            return {
              onClick: (e) => {
                e.stopPropagation();
                setUserData(items[index || 0]);
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
      <UserDetailsModal
        show={showModal}
        data={userData || baseUser}
        handleClose={() => {
          setShowModal(false);
        }}
      />
      <NotificationModal
        isOpen={openNotiModal}
        title={<p className="text-[#e9424d]">Can not disable user</p>}
        message={
          <p>
            There are valid assignments belonging to this user. Please close all
            assignment before disabling user.
          </p>
        }
        onCancel={() => setOpenNotiModal(false)}
      />
      <ConfirmationModal
        isOpen={openConfirmModal}
        title={<p className="text-[#e9424d]">Are you sure?</p>}
        message={<p>Do you want to disable this user?</p>}
        onCancel={() => setOpenConfirmModal(false)}
        buttontext="Disable"
        onConfirm={() => {
          handleDelete();
        }}
      />
    </div>
  );
}

export default ManageUserPage;
