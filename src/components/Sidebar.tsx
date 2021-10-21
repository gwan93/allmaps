import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import SearchBar from "./SearchBar";
import { FeatureCollection } from "geojson";
import PreviewResults from "./PreviewResults";

const StyledSidebar = styled.div`
  border: 2px solid lightgrey;
  border-radius: 5px;
  margin: 0 0.5em 0 0;
  width: 30%;
  display: flex;
  justify-content: center;
  height: 95vh
`;

const StyledTrailListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0.5em;
  width: 100%;
`;

const StyledTrailSelector = styled.div`
  border: 2px solid lightgrey;
  padding: 10px;
  margin: 2px 0;
  border-radius: 5px;
  &:hover {
    border-color: #75cff0;
    background-color: #75cff0;
    cursor: pointer;
  }
`;

const getTrails = () => {
  return fetch("data/trails/all-trails.json").then((res) => res.json());
};

interface Props {
  trailHandler: (trail: Trail) => void;
  searchHandler: (searchTerm: string) => void;
  autoCompleteList: FeatureCollection | undefined;
  previewOnClick: (result: any) => void;
  autoCompleteHandler: (searchTerm: string) => void;
}

interface Trail {
  name: string;
  filename: string;
}

export default function Sidebar({
  trailHandler,
  searchHandler,
  autoCompleteList,
  previewOnClick,
  autoCompleteHandler,
}: Props) {
  const [trails, setTrails] = useState<[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    getTrails().then(({ trails }) => {
      setTrails(trails);
    });
  }, []);

  return (
    <StyledSidebar>
      <StyledTrailListContainer>
        <h1>AllMaps</h1>
        <SearchBar
          searchHandler={searchHandler}
          autoCompleteHandler={autoCompleteHandler}
          setShowPreview={setShowPreview}
        />
        {showPreview && (
          <PreviewResults
            autoCompleteList={autoCompleteList}
            previewOnClick={previewOnClick}
            setShowPreview={setShowPreview}
          />
        )}
        <h2>Saved Trails</h2>
        {trails.map((trail: Trail) => {
          return (
            <StyledTrailSelector
              key={trail.name}
              onClick={() => trailHandler(trail)}
            >
              {trail.name}
            </StyledTrailSelector>
          );
        })}
      </StyledTrailListContainer>
    </StyledSidebar>
  );
}

Sidebar.propTypes = {
  trailHandler: PropTypes.func,
  searchHandler: PropTypes.func,
  autoCompleteList: PropTypes.object,
  previewOnClick: PropTypes.func,
  autoCompleteHandler: PropTypes.func,
};
