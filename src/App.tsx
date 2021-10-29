import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import styled from 'styled-components'
import React, { useState } from 'react';
import { Feature, MultiLineString, FeatureCollection } from "geojson";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1em 2em 1em 2em;
  flex: 1;
`

const StyledAppContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100vh;
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
  return fetch(baseURL.toString()).then((response) => response.json())
};

function App() {
  const [selectedTrail, setSelectedTrail] = useState<Feature<MultiLineString> | undefined>();
  const [autoCompleteList, setAutoCompleteList] = useState<FeatureCollection | undefined>();
  const [searchResult, setSearchResult] = useState<FeatureCollection | undefined>();
  
  const trailHandler = (trail: Trail) => {
    getTrailData(trail.filename).then((response) => {
      setSelectedTrail(response);
    });
  };

  // When user hits 'enter' on search bar
  // If search term is <= 4 characters, display a list for suggested search results to select from
  const searchHandler = (searchTerm: string) => {
    setSelectedTrail(undefined);
    getSearchResult(searchTerm).then((response: FeatureCollection) => {
      if (searchTerm.length <= 4) {
        setAutoCompleteList(response);
      } else {
        setSearchResult(response)
      }
    });
  };

  // Search function as user is typing in the search input
  // Only perform autocomplete search when string length is greater than 4
  const autoCompleteHandler = (searchTerm: string) => {
    setSelectedTrail(undefined);
    if (searchTerm?.length > 4) {
      getSearchResult(searchTerm).then((response: FeatureCollection) => {
        setAutoCompleteList(response);
      })
    }
  }

  const previewOnClick = (result: any) => {
    setSearchResult(result);
  }
  
  return (
    <StyledAppContainer>
      <StyledContainer className="main-container">
        <Sidebar
          trailHandler={trailHandler}
          searchHandler={searchHandler}
          autoCompleteList={autoCompleteList}
          previewOnClick={previewOnClick}
          autoCompleteHandler={autoCompleteHandler}
        />
        <MapArea selectedTrail={selectedTrail} searchResult={searchResult} />
      </StyledContainer>
    </StyledAppContainer>
  );
}

export default App;

