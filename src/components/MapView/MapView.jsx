"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView({ properties }) {
  
  const defaultCenter = [23.8103, 90.4125]; // Dhaka

    
  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      scrollWheelZoom={true}
      className=" h-[500px] w-2xl rounded-2xl mx-auto"
    >
      <TileLayer
        attribution='© OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {properties.map((p) => (
        <Marker
          key={p._id}
          position={[
            p.location.coordinates[1],
            p.location.coordinates[0],
          ]}
        >
          <Popup>
            <Link href={`/stays/${p._id}`}>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{p.title}</p>
              <p className="text-gray-500">${p.pricePerNight} / night</p>
            </div>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
