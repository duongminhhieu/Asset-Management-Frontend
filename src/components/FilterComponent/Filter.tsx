import { FilterFilled } from "@ant-design/icons";
import { Button, Flex, Popover, Space } from "antd";
import CheckBoxGroup from "./CheckBoxGroup";
import ExclusiveCheckBoxes from "./ExclusiveCheckBoxes";
interface Props {
  title: string;
  options: { value: string; label: string }[];
  paramName: string;
  allowedMultiple?: boolean;
}
const Filter = ({
  title,
  options,
  paramName,
  allowedMultiple = false,
}: Props) => {
  return (
    <Flex>
      <Popover
        content={
          allowedMultiple ? (
            <CheckBoxGroup options={options} paramName={paramName} />
          ) : (
            <ExclusiveCheckBoxes options={options} paramName={paramName} />
          )
        }
        trigger="click"
        placement="bottomRight"
      >
        <Space.Compact>
          <Button id="TitleButton">{title}</Button>
          <Button id="IconButton">
            <FilterFilled />
          </Button>
        </Space.Compact>
        <div />
      </Popover>
    </Flex>
  );
};

export default Filter;
