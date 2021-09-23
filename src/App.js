import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import styled from 'styled-components'
import React, { useState } from 'react';

const StyledContainer = styled.div`
  // border: 2px solid orange;
  display: flex;
  flex-direction: row;
  padding: 1em 2em 1em 2em;
  flex: 1;
`

const StyledAppContainer = styled.div`
  // border: 2px solid yellow;
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const getTrailData = (trailFilename) => 
  fetch(`data/trails/${trailFilename}`)
  .then((res) => res.json())
  .then((res) => res.features.find((feature) => feature.geometry.type === "MultiLineString"))
;


function App() {
  const [selectedTrail, setSelectedTrail] = useState({});
  
  const trailHandler = (trail) => {
    getTrailData(trail.filename).then((response) => {
      setSelectedTrail(response);
    });
  };
  
  return (
    <StyledAppContainer>
      <Header/>
      <StyledContainer className="main-container">
        <Sidebar trailHandler={trailHandler}/>
        <MapArea selectedTrail={selectedTrail}/>
      </StyledContainer>
    </StyledAppContainer>
  );
}

export default App;
