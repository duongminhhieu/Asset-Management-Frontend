import { Input } from "antd";

const { Search } = Input;
function SearchFieldComponent({
  onSearch,
}: {
  onSearch: (value: string) => void;
}) {
  return (
    <div>
      <Search
        id="search user"
        placeholder="input search text "
        onSearch={onSearch}
        className="w-64"
      />
    </div>
  );
}

export default SearchFieldComponent;
