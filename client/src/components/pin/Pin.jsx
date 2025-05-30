import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";

function Pin({ item }) {
  console.log("Pin item:", item);
  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popupCont">
          <img src={item.images[0]} alt="" />
          <div className="textCont">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span>{item.bedroom} bedroom</span>
            <b>{item.price} DZD</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
