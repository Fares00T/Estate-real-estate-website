import Card from "../../components/card/Card";
import Filter from "../../components/filter/Filter";
import { listData } from "../../components/lib/dummydata";
import Map from "../../components/map/Map";
import "./listpage.scss";

export default function ListPage() {
  const data = listData;
  return (
    <div className="listPage">
      <div className="listCont">
        <div className="wrapper">
          <Filter />
          {data.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>
      <div className="mapCont">
        <Map items={data} />
      </div>
    </div>
  );
}
