import { DatePicker } from "antd";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs"
interface Props {
  paramName: string;
}

function DateFilter({ paramName }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
      <DatePicker data-testid="filter"
        defaultValue={searchParams.get(paramName)?dayjs(searchParams.get(paramName), "YYYY-MM-DD"):null}
        onChange={(e) => {
          if (e == null){
            setSearchParams(p=>{
              p.delete(paramName);
              return p;
            })
          }
          setSearchParams((p) => {
            const date = e.date() >= 10 ? e.date().toString() : "0" + e.date();
            const month =
              e.month() + 1 >= 10 ? e.month() + 1 : "0" + String(e.month() + 1);
            const year = e.year();
            p.set(paramName, year + "-" + month + "-" + date  );
            return p;
          });
        }}
      />
  );
}

export default DateFilter;
