import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Tooltip,
} from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";

function Map({ items }) {
  // Rough bounding box around the label area of Israel
  const israelLabelMask = [
    [31.6, 35.2],
    [31.6, 34.7],
    [30.8, 34.7],
    [30.8, 35.2],
  ];

  const customLabelPosition = [31.2, 34.95]; // Adjust as needed

  return (
    <MapContainer
      center={
        items.length === 1
          ? [items[0].latitude, items[0].longitude]
          : [36.738007, 3.150805]
      }
      zoom={8}
      scrollWheelZoom={true}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Mask the original country label */}
      <Polygon
        positions={israelLabelMask}
        pathOptions={{
          color: "white",
          fillColor: "white",
          fillOpacity: 1,
          weight: 0,
        }}
      />

      {/* Custom country label */}
      <Marker position={customLabelPosition} opacity={0}>
        <Tooltip permanent direction="center" className="country-label">
          Palestine
        </Tooltip>
      </Marker>

      {/* Pins */}
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  );
}

export default Map;
