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
import { useRef, useState } from "react";
import Navbar from "./Navbar";

const center = { lat: 48.8584, lng: 2.2945 };

function Places() {
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

  const originRef = useRef();
  const destinationRef = useRef();
  const searchRef = useRef();

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
            center={center}
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
            <Marker position={center} />
            {searchLocation && <Marker position={searchLocation} />}
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </Box>
        <Box
          p={10}
          m={4}
          bgColor="white"
          shadow="base"
          minW="container.md"
          zIndex="1"
          border="2px solid black"
          borderRadius="10px"
        >
          {/* Location Search Section */}
          <HStack spacing={2} justifyContent="space-between" mb={4}>
            <Box
              flexGrow={1}
              border="2px solid black"
              borderRadius="10px"
              p={2}
            >
              <Autocomplete>
                <Input
                  type="text"
                  placeholder="Search Location"
                  ref={searchRef}
                  outline={"none"}
                  p={4}
                />
              </Autocomplete>
            </Box>
            <Button
              colorScheme="pink"
              onClick={searchPlace}
              bg={"#5a4ae3"}
              color={"#fff"}
              p={5}
              border={"4px solid #5a4ae3"}
              borderRadius={"10px"}
              transition={"all .7s ease-in-out"}
              _hover={{
                bg: "white",
                color: "#5a4ae3",
              }}
            >
              Search Location
            </Button>
          </HStack>

          {/* Traffic Layer Toggle */}
          <HStack spacing={2} justifyContent="center">
            <Button
              colorScheme="pink"
              onClick={toggleTrafficLayer}
              bg={"#5a4ae3"}
              color={"#fff"}
              p={5}
              border={"4px solid #5a4ae3"}
              borderRadius={"10px"}
              transition={"all .7s ease-in-out"}
              _hover={{
                bg: "white",
                color: "#5a4ae3",
              }}
            >
              {trafficLayerVisible ? "Hide Traffic" : "Show Traffic"}
            </Button>
          </HStack>
        </Box>
      </Flex>
    </div>
  );
}

export default Places;
