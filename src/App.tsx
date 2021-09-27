import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import styled from 'styled-components'
import { useState } from 'react';
import { Feature, MultiLineString } from "geojson";


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

const getTrailData = (trailFilename: string) => 
  fetch(`data/trails/${trailFilename}`)
  .then((res) => res.json())
  .then((res) => res.features.find((feature: Feature) => feature.geometry.type === "MultiLineString"))
;

function App() {
  const [selectedTrail, setSelectedTrail] = useState<Feature<MultiLineString> | undefined>(undefined);
  
  const trailHandler = (trail: Trail) => {
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
