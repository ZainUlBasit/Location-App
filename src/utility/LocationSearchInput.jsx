// LocationSearchInput.js
import React, { useEffect, useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { getCoordinates } from "./googlemap";

const LocationSearchInput = ({ onSelect, CurrentValue, Placeholder }) => {
  const [address, setAddress] = useState("");
  const [SelectionDone, setSelectionDone] = useState(false);

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleSelect = async (newAddress) => {
    setSelectionDone(!SelectionDone);
    const results = await geocodeByAddress(newAddress);
    const latLng = await getLatLng(results[0]);
    onSelect({ address: newAddress, latLng });
    setAddress(newAddress);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (CurrentValue) {
          setAddress(CurrentValue);
          const results = await geocodeByAddress(CurrentValue);
          const latLng = await getLatLng(results[0]);
          onSelect({ address: CurrentValue, latLng });
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };

    fetchData();
  }, [CurrentValue]);

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <div className="relative w-[297px] maxInputWidth font-[Quicksand]">
            {/* <p className="absolute top-[-11px] left-3 w-fit bg-white h-[13px] text-[15px] font-bold InputLabel">
              Address
            </p> */}
            <input
              {...getInputProps({
                placeholder: Placeholder,
                // placeholder: "Search Places ...",
                className:
                  "location-search-input px-2 py-2 border border-gray-300 rounded-[7.94px] w-full outline-none InputText",
              })}
            />
          </div>
          {/* <input
            {...getInputProps({
              placeholder: "Search Places ...",
              className: "location-search-input",
            })}
          /> */}
          <div className="autocomplete-dropdown-container absolute z-10">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion, i) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              const style = suggestion.active
                ? { backgroundColor: "#fafafa", cursor: "pointer" }
                : { backgroundColor: "#ffffff", cursor: "pointer" };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                  key={i}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default LocationSearchInput;
