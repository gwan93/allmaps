import styled from 'styled-components'
import React, { useRef, useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import './MapArea.css';

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

export default function MapArea() {

  const [ style, setStyle ] = useState('mapbox://styles/ntension/ckta6yvwi3ddt18mgkrjjegw8');
  const [ latitude, setLatitude ] = useState(45.393);
  const [ longitude, setLongitude ]= useState(-75.511);
  const [ zoom, setZoom ] = useState(1);
  const mapContainer = useRef(null)
	const map = useRef(null);
	// this is where all of our map logic is going to live  
	// adding the empty dependency array ensures that the map  
	// is only created once  
	useEffect(() => {    
		// create the map and configure it    
		// check out the API reference for more options    
		// https://docs.mapbox.com/mapbox-gl-js/api/map/  
    // if (map.current) return;  
		map.current = new mapboxgl.Map({      
			container: mapContainer.current,      
			style,      
			center: [longitude, latitude],      
			zoom,    
		})

		// cleanup function to remove map on unmount
		return () => map.current.remove() 
	}, [style])


  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLongitude(map.current.getCenter().lng.toFixed(4));
      setLatitude(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const changeStyle = (styleURL) => {
    console.log('styleURL -> ', styleURL)
    setStyle(styleURL);
  }

	return (
    <StyledMapAreaContainer>
      <StyleBar class="mapStyleBar" onChange={e => changeStyle(e.target.value)}>
        <input type="radio" id="streets-v11" value="mapbox://styles/mapbox/streets-v11" name="Style"/>
        <label htmlFor="streets-v11">Streets</label>
        <input type="radio" id="outdoors-v11" value="mapbox://styles/mapbox/outdoors-v11" name="Style"/>
        <label htmlFor="outdoors-v11">Outdoors</label>
        <input type="radio" id="light-v10" value="mapbox://styles/mapbox/light-v10" name="Style"/>
        <label htmlFor="light-v10">Light</label>
        <input type="radio" id="dark-v10" value="mapbox://styles/mapbox/dark-v10" name="Style"/>
        <label htmlFor="dark-v10">Dark</label>
      </StyleBar>
      <StyledMapArea id="map" 
        ref={mapContainer}
      />

    </StyledMapAreaContainer>

	)
}