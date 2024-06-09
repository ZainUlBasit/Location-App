import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes, FaSearchLocation } from "react-icons/fa";
import { FaExchangeAlt } from "react-icons/fa";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef, useState, useEffect } from "react";
import Navbar from "./Navbar";

const center = { lat: 48.8584, lng: 2.2945 };

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCn3iFUNjO37dPrLUYkJLxW_Iqxcuojq_A",
    libraries: ["places"],
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [searchLocation, setSearchLocation] = useState(null);
  const [trafficLayerVisible, setTrafficLayerVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const originRef = useRef();
  const destinationRef = useRef();
  const searchRef = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            if (status === "OK" && results[0]) {
              const city = results[0].address_components.find((component) =>
                component.types.includes("locality")
              ).long_name;
              originRef.current.value = city;
              setCurrentLocation({ lat: latitude, lng: longitude });
            } else {
              console.error("Geocoder failed due to: " + status);
            }
          }
        );
      });
    }
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  async function calculateRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  async function searchPlace() {
    if (searchRef.current.value === "") {
      return;
    }
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { address: searchRef.current.value },
      (results, status) => {
        if (status === "OK") {
          const location = results[0].geometry.location;
          setSearchLocation(location);
          map.panTo(location);
          map.setZoom(15);
        } else {
          alert(
            "Geocode was not successful for the following reason: " + status
          );
        }
      }
    );
  }

  function toggleTrafficLayer() {
    if (map) {
      if (trafficLayerVisible) {
        map.setOptions({ styles: [] });
        setTrafficLayerVisible(false);
      } else {
        map.setOptions({
          styles: [
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#ff0000" }],
            },
          ],
        });
        setTrafficLayerVisible(true);
      }
    }
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />
      <Flex
        position="relative"
        flexDirection="column"
        alignItems="center"
        h="85vh"
        w="100vw"
      >
        <Box position="absolute" left={0} top={0} h="100%" w="100%">
          <GoogleMap
            center={currentLocation || center}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => {
              setMap(map);
            }}
          >
            {currentLocation && <Marker position={currentLocation} />}
            {searchLocation && <Marker position={searchLocation} />}
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </Box>
      </Flex>
    </div>
  );
}

export default App;
