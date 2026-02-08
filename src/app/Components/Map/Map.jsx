import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export default function Map({ listings, onCityClick }) {
  const [cityCoords, setCityCoords] = useState([]);
  const mapRef = useRef(null);
  const popupRefs = useRef({}); // store popup references

  useEffect(() => {
    const fetchCoords = async () => {
      const LModule = await import("leaflet");
      const L = LModule.default || LModule;

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });

      const seen = new Set();
      const cities = [];
      listings.forEach((l) => {
        const city = l.city.trim();
        if (!seen.has(city.toLowerCase())) {
          seen.add(city.toLowerCase());
          cities.push(city);
        }
      });

      try {
        const results = await Promise.all(
          cities.map(async (city) => {
            const res = await fetch(`/api/geocode?city=${encodeURIComponent(city)}`);
            const data = await res.json();
            if (data[0]) return { city, lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
            return null;
          })
        );
        setCityCoords(results.filter(Boolean));
      } catch (err) {
        console.error(err);
      }
    };

    if (listings.length) fetchCoords();
  }, [listings]);

  if (!cityCoords.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-6 h-6 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin"></div>
        <span className="ml-4 text-lg text-foreground">Loading map...</span>
      </div>
    );
  }

  const handleClearFilter = (city) => {
    // Close the popup
    if (popupRefs.current[city]) {
      popupRefs.current[city].close();
    }
    onCityClick("");
  };

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden mb-6 relative z-0">
      <MapContainer
        ref={mapRef}
        center={[cityCoords[0].lat, cityCoords[0].lon]}
        zoom={5}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {cityCoords.map((c, idx) => (
          <Marker
            key={idx}
            position={[c.lat, c.lon]}
            eventHandlers={{
              click: () => onCityClick?.(c.city),
              popupclose: () => onCityClick?.(""), // clear filter when popup is closed
            }}
          >
            <Popup>
              <div className="flex flex-col gap-2">
                <span className="font-semibold">{c.city}</span>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}
