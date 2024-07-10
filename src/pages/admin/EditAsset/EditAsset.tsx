import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Spin,
  Typography,
  message,
  Radio,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import APIResponse from "@/types/APIResponse";
import dayjs from "dayjs";
import NotFoundPage from "@/components/404NotFound/NotFoundPage";
import { AssetAPICaller } from "@/services/apis/asset.api";
import { AssetEdit } from "@/types/Asset";

type CreateAssetBody = {
  name: string;
  specification: string;
  installDate: Date;
  state: string;
  version: number;
};

function EditAsset() {
  // state
  const { id } = useParams<{ id: string }>();

  const isValidId = (id: string) => {
    return !isNaN(Number(id));
  };

  if (!isValidId(id as string)) {
    return <NotFoundPage />;
  }

  // state
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [version, setVersion] = useState(-1);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // query
  const { mutate, data, isLoading, isError, error, isSuccess } = useMutation(
    AssetAPICaller.editAsset
  );

  const {
    data: assetData,
    isSuccess: isGetAssetSuccess,
    isLoading: isGetAssetLoading,
    error: getAssetError,
  } = useQuery(
    ["getAsset", { id }],
    () => AssetAPICaller.getAsset(Number.parseInt(id ?? "0")),
    { retry: false }
  );

  // useEffect
  useEffect(() => {
    if (isGetAssetSuccess && assetData) {
      const data = assetData?.data as APIResponse;
      const asset = data.result as AssetEdit;

      form.setFieldsValue({
        name: asset.name,
        specification: asset.specification,
        installDate: dayjs(asset.installDate).valueOf(),
        category: asset.category,
        state: asset.state.toLowerCase(),
        version: asset.version,
      });
      setVersion(asset.version);
    }
  }, [isGetAssetSuccess, assetData]);

  useEffect(() => {
    if (isError) {
      const errorResponse = (error as { response: { data: APIResponse } })
        .response?.data;
      message.error(errorResponse.message);
    }

    if (isSuccess) {
      const newAsset: AssetEdit = data.data.result;
      navigate("/admin/assets", {
        state: {
          asset: newAsset,
        },
      });
      message.success("Update asset success");
    }
  }, [isSuccess, isError]);

  const onFinish = (values: CreateAssetBody) => {
    const body = {
      name: values.name,
      specification: values.specification,
      installDate: dayjs(values.installDate).format("YYYY-MM-DD"),
      state: values.state,
      version: version,
    };

    mutate({ assetId: Number.parseInt(id ?? "0"), body });
  };

  const handleFieldsChange = () => {
    const fields = form.getFieldsValue();
    const { name, installDate, specification, state } = fields;

    setIsButtonDisabled(
      !name ||
        !installDate ||
        !specification ||
        !state ||
        name.length > 255 ||
        specification.length > 1024
    );
  };

  if (isGetAssetLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spin
          size="large"
          indicator={<LoadingOutlined spin />}
          className="text-[#cf2338]"
        />
      </div>
    );
  }

  if (getAssetError) {
    return <div>asset Not Found</div>;
  }
  return (
    <>
      <Typography className="text-xl font-semibold text-[#cf2338] font-serif pb-5">
        Edit asset
      </Typography>

      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        style={{ maxWidth: 800 }}
        colon={false}
        requiredMark={false}
        onFinish={onFinish}
        onFieldsChange={handleFieldsChange}
      >
        <Form.Item
          label="Name"
          name="name"
          hasFeedback
          labelAlign="left"
          rules={[
            { max: 255, message: "Must be less than 255 characters!" },
            { required: true, message: "Please insert name" },
          ]}
        >
          <Input name="name" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          hasFeedback
          labelAlign="left"
        >
          <Input name="category" readOnly disabled />
        </Form.Item>

        <Form.Item
          label="Installed Date"
          name="installDate"
          hasFeedback
          labelAlign="left"
          getValueProps={(value) => ({ value: value && dayjs(Number(value)) })}
          rules={[{ required: true, message: "Please insert install date" }]}
        >
          <DatePicker
            type="date"
            data-testid="installDate"
            style={{ width: "100%" }}
            disabledDate={(current) => {
              const today = new Date();
              const threeMonthsAgo = new Date();
              threeMonthsAgo.setMonth(today.getMonth() - 3);
              threeMonthsAgo.setDate(today.getDate());
              const currentDate = current.toDate();
              return (
                currentDate &&
                currentDate <= threeMonthsAgo &&
                currentDate < dayjs(assetData?.data.result.installDate).toDate()
              );
            }}
          />
        </Form.Item>

        <Form.Item
          name="specification"
          label="Specification"
          labelAlign="left"
          hasFeedback
          rules={[
            { max: 1024, message: "Must be less than 1024 characters!" },
            { required: true, message: "Please insert specification" },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Note" />
        </Form.Item>

        <Form.Item name="state" labelAlign="left" label="State" hasFeedback>
          <Radio.Group className="flex flex-col" aria-label="State">
            <Radio id="state" value="available" aria-label="Available">
              Available
            </Radio>
            <Radio id="state" value="not_available" aria-label="Not Available">
              Not Available
            </Radio>
            <Radio
              id="state"
              value="waiting_for_recycle"
              aria-label="Waiting For Recycle"
            >
              Waiting For Recycle
            </Radio>
            <Radio id="state" value="recycled" aria-label="Recycled">
              Recycled
            </Radio>
          </Radio.Group>
        </Form.Item>

        <div
          className="button-container"
          style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}
        >
          <Form.Item>
            <Button
              type="primary"
              name="save"
              danger
              htmlType="submit"
              loading={isLoading}
              disabled={isButtonDisabled}
            >
              Save
            </Button>
          </Form.Item>
          <Form.Item label="">
            <Button
              onClick={() => {
                navigate("/admin/assets");
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
}

export default EditAsset;
