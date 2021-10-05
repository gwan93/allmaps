import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
// import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import styled from 'styled-components'
import React, { useState } from 'react';
import { Feature, FeatureCollection, MultiLineString } from "geojson";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1em 2em 1em 2em;
  flex: 1;
`

const StyledAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

interface Trail {
  name: string;
  filename: string;
}

interface QueryParams {
  [key: string]: string | number | undefined;
}

const getTrailData = (trailFilename: string) => 
  fetch(`data/trails/${trailFilename}`)
  .then((res) => res.json())
  .then((res) => res.features.find((feature: Feature) => feature.geometry.type === "MultiLineString"))
;

const getSearchResult = (search: string)=> {
  const baseURL = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json`)
  const queryParams: QueryParams = {
    "access_token": process.env.REACT_APP_MAPBOX_TOKEN,
    "limit": 10
  }
  Object.keys(queryParams).forEach((key) => 
    baseURL.searchParams.append(key, queryParams[key] as string)
  )
  return fetch(baseURL as unknown as string).then((response) => response.json())
};

function App() {
  const [selectedTrail, setSelectedTrail] = useState<Feature<MultiLineString> | undefined>(undefined);
  const [searchResult, setSearchResult] = useState<FeatureCollection | undefined>(undefined);
  
  const trailHandler = (trail: Trail) => {
    getTrailData(trail.filename).then((response) => {
      setSelectedTrail(response);
    });
  };

  const searchHandler = (searchTerm: string) => {
    setSelectedTrail(undefined);
    getSearchResult(searchTerm).then((response: FeatureCollection) =>
      setSearchResult(response)
    );
  };
  
  return (
    <StyledAppContainer>
      {/* <Header/> */}
      <StyledContainer className="main-container">
        <Sidebar trailHandler={trailHandler} searchHandler={searchHandler}/>
        <MapArea selectedTrail={selectedTrail} searchResult={searchResult}/>
      </StyledContainer>
    </StyledAppContainer>
  );
}

export default App;
