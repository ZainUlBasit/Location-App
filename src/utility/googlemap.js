import axios from "axios";

export const getCoordinates = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  try {
    const response = await axios.get(url);
    const { lat, lon } = response.data[0];
    return { lat, lon };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};
