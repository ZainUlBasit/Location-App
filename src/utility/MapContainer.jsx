import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { MdLocationPin } from "react-icons/md";

const Marker = ({ lat, lng }) => (
  <div
    style={{
      color: "red",
      fontSize: "35px",
      marginTop: "-35px",
      marginLeft: "-14px",
    }}
  >
    <MdLocationPin />
  </div>
);

export default function MapContainer({
  SearchLan,
  SearchLat,
  setLongitude,
  setLatitude,
  setAddress,
  origin,
  destination,
}) {
  const [center, setCenter] = useState({
    lat: SearchLat,
    lng: SearchLan,
  });
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (navigator.geolocation && !SearchLan && !SearchLat) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user's current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    // Initialize Directions Service and Directions Renderer
    setDirectionsService(new window.google.maps.DirectionsService());
    setDirectionsRenderer(new window.google.maps.DirectionsRenderer());
  }, []);

  useEffect(() => {
    if (SearchLat && SearchLan) {
      setCenter({ lat: SearchLat, lng: SearchLan });
    }
  }, [SearchLat, SearchLan]);

  useEffect(() => {
    if (origin && destination && directionsService && directionsRenderer) {
      const request = {
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        destination: new window.google.maps.LatLng(
          destination.lat,
          destination.lng
        ),
        travelMode: window.google.maps.TravelMode.DRIVING,
      };
      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Error fetching directions:", status);
        }
      });
    }
  }, [origin, destination, directionsService, directionsRenderer]);

  const handleMapClick = ({ lat, lng }) => {
    setLatitude(lat);
    setLongitude(lng);
    fetchAddress(lat, lng);
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_API_KEY`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      } else {
        setAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error fetching address");
    }
  };

  return (
    <div className="w-full h-full">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "YOUR_API_KEY" }}
        center={center}
        defaultZoom={11}
        onClick={handleMapClick}
        options={{
          fullscreenControl: false,
        }}
      >
        {/* Marker for current location */}
        <Marker lat={center.lat} lng={center.lng} />
      </GoogleMapReact>
    </div>
  );
}
