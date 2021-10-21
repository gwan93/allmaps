import styled from 'styled-components'
import PropTypes from 'prop-types';
import React, { useRef, useEffect, useState, RefObject } from "react"
import mapboxgl, { Map, Marker, LngLatLike } from "mapbox-gl"
import { Feature } from "geojson";
import './MapArea.css';
import ElevationProfile from './ElevationProfile';
import { MultiLineString } from '@turf/turf';

interface Viewport {
  center: LngLatLike;
  zoom: number;
}
interface Props {
  selectedTrail: Feature<MultiLineString> | undefined;
  searchResult: any;
}

const DEFAULT_VIEWPORT: Viewport = {
  center: [-105.91641452832604, 55.50351451356939],
  zoom: 2
}
const BASE_LAYERS_ARRAY = [
  {label: 'Outdoors', value: 'outdoors-v11'},
  {label: 'Streets', value: 'streets-v11'},
  {label: 'Light', value: 'light-v10'},
  {label: 'Dark', value: 'dark-v10'}
]
const StyledMapArea = styled.div`
  height: calc(100% - 220px); // minus the height of ElevationProfile
`
const StyledMapAreaContainer = styled.div`
  flex: 1;
  height: 95vh;
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

export default function MapArea({ selectedTrail, searchResult }: Props) {
  const mapContainer = useRef<HTMLDivElement | string>('');
  const map = useRef<Map | null>(null);
  const marker = useRef<Marker | null>(null);
  const [mouseOverCoords, setMouseOverCoords] = useState<LngLatLike | undefined>(undefined);
  // const [POIMarkers, setPOIMarkers] = useState<Marker[]>([]);

  // Component Methods/Functions
  const displayDataOnMap = () => {
    // Do nothing if the passed in trailData is an empty object or undefined
    // Applicable when the map is first rendered and user has not selected
    // a trail to display yet
    if (selectedTrail === undefined) return;
    if (!map.current) return;
    map.current.addSource("selectedTrail", {
      type: "geojson",
      data: selectedTrail,
    });
  
    map.current.addLayer({
      id: "selectedTrail",
      type: "line",
      source: "selectedTrail",
      layout: {},
      paint: {
        "line-color": "#ec2222",
        "line-width": 2,
        "line-dasharray": [2, 1],
      },
    });
  };

  const clearDataFromMap = () => {
    if (map.current === null) return;
    // Mapbox will throw an error if you try to remove a layer that doesn't exist
    if (map.current.getLayer("selectedTrail")) {
      map.current.removeLayer("selectedTrail");
      map.current.removeSource("selectedTrail");
    }
    marker.current?.remove();

    if (map.current.getLayer("markers")) {
      map.current.removeLayer("markers");
      map.current.removeSource("markers")
    }

    // POIMarkers.forEach((marker: Marker) => marker.remove())
    // setPOIMarkers([]);
  };

  const fitBoundsWithBbox = (west: number, north: number, east: number, south: number) => {
    map.current?.fitBounds(
      [[west, north], [east, south]],
      {
        padding: {top: 100, bottom: 50, left: 60, right: 60},
        linear: true
      }
    )
  };

  const flyToTrail = () => {
    const [east, north, west, south] = selectedTrail?.geometry.bbox as number[];
    fitBoundsWithBbox(west, north, east, south);
  };

  const moveMarker = () => {
    if (selectedTrail === undefined) return;
    // Initialize marker at the trail head
    const trailHeadCoord = selectedTrail.geometry.coordinates[0][0];
    if (map.current) {
      marker.current?.setLngLat(trailHeadCoord as LngLatLike).addTo(map.current);
    }
  };

  const changeStyle = (styleURL: string) => {
    map.current?.setStyle(styleURL);
  };
  
  useEffect(() => {
    // Render a map and configure it
    map.current = new mapboxgl.Map({
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v11",
      ...DEFAULT_VIEWPORT,
    });

    marker.current = new mapboxgl.Marker()

    return () => {
      map.current?.remove();
      marker!.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!selectedTrail) return;
    // Persist data when switching base layers (streets, satellites, etc)
    map.current?.on("style.load", () => {
      // When style has finished loading, invoke the following:
      clearDataFromMap();
      displayDataOnMap();
      moveMarker();
    });
    
    clearDataFromMap();
    // Render trail data based on the trail selected in the sidebar
    if (map.current?.isStyleLoaded()) {
      displayDataOnMap();
      moveMarker();
      flyToTrail();
    }
  }, [selectedTrail]);

  useEffect(() => {
    if (map.current?.isStyleLoaded()) marker.current?.setLngLat(mouseOverCoords as LngLatLike)
  }, [mouseOverCoords]);

  // Move the map when a user submits a search result
  useEffect(() => {
    if (map.current === null || searchResult === undefined) return;
    clearDataFromMap();
    // When user hits enter on search bar
    if (searchResult.type === "FeatureCollection") {
      if (searchResult.features[0]?.place_type[0] === 'place') {
        // If search result returns with a 'place' as the first result, center on that. eg. "Edmonton"
        const [west, north, east, south] = searchResult.features[0].bbox as number[];
        fitBoundsWithBbox(west, north, east, south);
      } else {
        // Create markers for each of the returned search results. eg. "Edmonton Costcos"
        map.current?.flyTo({
          center: searchResult.features[0].center,
          zoom: 11
        })
        addSearchMarkersToMap(searchResult.features);
      }
    // When user selects a result from the search autocomplete results
    } else if (searchResult.type === "Feature") {
      map.current?.flyTo({
        center: searchResult.center,
        zoom: 11
      })
      addSearchMarkersToMap([searchResult]);
    }
  }, [searchResult])

  const addSearchMarkersToMap = (markerData: any) => {
    // Add 'place_name' key and its value to the properties object
    // This allows the marker event to have access to the value of 'place_name'
    markerData.forEach((marker: any) => {
      marker.properties['place_name'] = marker.place_name;
    })

    map.current?.loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/780px-Map_marker.svg.png",
      (error, image) => {
        if (error) throw error;

        if (!map.current?.hasImage("blueMarker")) {
          map.current?.addImage("blueMarker", image as HTMLImageElement);
        }

        map.current?.addSource("markers", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [...markerData],
          },
        });

        map.current?.addLayer({
          id: "markers",
          type: "symbol",
          source: "markers",
          layout: {
            'icon-image': 'blueMarker',
            'icon-size': 0.03,
            'icon-allow-overlap': true
          }
        });
      }
    );

    map.current?.on('click', 'markers', (e: any) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.place_name

      new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`<p>${description}</p>`)
      .addTo(map.current as Map)
    })
  };

  return (
    <StyledMapAreaContainer>
      <StyleBar
        className="mapStyleBar"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          changeStyle(e.target.value)
        }
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
      <StyledMapArea id="map" ref={mapContainer as RefObject<HTMLDivElement>} />
      <ElevationProfile
        selectedTrail={selectedTrail}
        setMouseOverCoords={setMouseOverCoords}
      />
    </StyledMapAreaContainer>
  );
}

MapArea.propTypes = {
  selectedTrail: PropTypes.object,
  searchResult: PropTypes.object,
};
