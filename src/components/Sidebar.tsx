import React, { useEffect, useState, useRef, RefObject } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import SearchBar from "./SearchBar";
import { FeatureCollection } from "geojson";
import PreviewResults from "./PreviewResults";

const PreviewRefContainer = styled.div``;

const StyledSidebar = styled.div`
  border: 2px solid lightgrey;
  border-radius: 5px;
  margin: 0 0.5em 0 0;
  width: 30%;
  display: flex;
  justify-content: center;
`;

const StyledTrailListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTrailSelector = styled.div`
  border: 2px solid lightgrey;
  padding: 10px;
  margin: 2px 0 2px 0;
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

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useOutsideAlerter(wrapperRef);
  const [trails, setTrails] = useState<[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    getTrails().then(({ trails }) => {
      setTrails(trails);
    });
  }, []);

  // Closes the previews when the user clicks somewhere else in the app
  function useOutsideAlerter(ref: React.MutableRefObject<HTMLDivElement | null>) {
    useEffect(() => {
      if (ref.current === null) return;
      function handleClickOutside(event: MouseEvent) {
        if (!ref.current?.contains(event.target as Node)) {
          setShowPreview(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <StyledSidebar>
      <StyledTrailListContainer>
        <h1>AllMaps</h1>
        <SearchBar
          searchHandler={searchHandler}
          autoCompleteHandler={autoCompleteHandler}
          setShowPreview={setShowPreview}
        />
        <PreviewRefContainer ref={wrapperRef as RefObject<HTMLDivElement>}>
          {showPreview && (
            <PreviewResults
              autoCompleteList={autoCompleteList}
              previewOnClick={previewOnClick}
              setShowPreview={setShowPreview}
            />
          )}
        </PreviewRefContainer>
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
