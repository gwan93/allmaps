import styled from 'styled-components'
import React, { useRef, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import './MapArea.css';

const DEFAULT_VIEWPORT = {
  center: [-105.91641452832604, 55.50351451356939],
  zoom: 2
}

const BASE_LAYERS_ARRAY = [
  {label: 'Outdoors', value: 'outdoors-v11'},
  {label: 'Streets', value: 'streets-v11'},
  {label: 'Light', value: 'light-v10'},
  {label: 'Dark', value: 'dark-v10'}
]

// Grab the access token from your Mapbox account// I typically like to store sensitive things like this// in a .env file
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const StyledMapArea = styled.div`
  border: 2px solid green;
  height: 100%;
`
const StyledMapAreaContainer = styled.div`
  // border: 2px solid purple;
  flex: 1;
`
const StyleBar = styled.div`
  border: 1px solid black;
  background-color: rgba(255, 255, 255, 0.7);
  color: black;
  padding: 6px 12px;
  z-index: 1;
  position: absolute;
  margin: 12px;
  border-radius: 4px;
`

export default function MapArea({ selectedTrail }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
    
  const displayDataOnMap = (map, trailData) => {
    // Do nothing if the passed in trailData is an empty object or undefined
    // Applicable when the map is first rendered and user has not selected
    // a trail to display yet
    if (Object.keys(trailData).length === 0) return;

    map.current.addSource("trailData", {
      type: "geojson",
      data: trailData,
    });
  
    map.current.addLayer({
      id: "trailData",
      type: "line",
      source: "trailData",
      layout: {},
      paint: {
        "line-color": "#ec2222",
        "line-width": 2,
        "line-dasharray": [2, 1],
      },
    });
  };

  const clearDataFromMap = () => {
    // Mapbox will throw an error if you try to remove a layer that doesn't exist
    if (map.current.getLayer("trailData")) {
      map.current.removeLayer("trailData");
      map.current.removeSource("trailData");
    }
  };

  const flyToTrail = (map, selectedTrail) => {
    const [east, north, west, south] = selectedTrail.geometry.bbox;
    map.current.fitBounds(
      [[west, north], [east, south]],
      {
        padding: {top: 20, bottom: 20, left: 30, right: 30},
        linear: true
      }
    )
  };
  
  useEffect(() => {
    // Render a map and configure it
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v11",
      ...DEFAULT_VIEWPORT,
    });

    return () => map.current.remove();
  }, []);

  useEffect(() => {
    // Persist data when switching base layers (streets, satellites, etc)
    map.current.on("style.load", () => {
      // When style has finished loading, invoke the following:
      clearDataFromMap();
      displayDataOnMap(map, selectedTrail);
    });
    
    // Render trail data based on the trail selected in the sidebar
    clearDataFromMap();
    if (map.current.isStyleLoaded()) {
      displayDataOnMap(map, selectedTrail);
      flyToTrail(map, selectedTrail);
    }
  }, [selectedTrail]);


  const changeStyle = (styleURL) => {
    map.current.setStyle(styleURL);
  };

  return (
    <StyledMapAreaContainer>
      <StyleBar
        className="mapStyleBar"
        onChange={(e) => changeStyle(e.target.value)}
      >
        {BASE_LAYERS_ARRAY.map((baselayer, index) => {
          return (
            <React.Fragment key={baselayer.value}>
              <input
                type="radio"
                id={baselayer.value}
                value={`mapbox://styles/mapbox/${baselayer.value}`}
                name="Style"
                defaultChecked={index === 0}
              />
              <label htmlFor={baselayer.value}>{baselayer.label}</label>
            </React.Fragment>
          );
        })}
      </StyleBar>
      <StyledMapArea id="map" ref={mapContainer} />
    </StyledMapAreaContainer>
  );
}