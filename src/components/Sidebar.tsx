import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import FilterBar from './FilterBar';

const StyledSidebar = styled.div`
  border: 2px solid lightgrey;
  border-radius: 5px;
  margin: 0 0.5em 0 0;
  padding: 0 0 0 1em;
  width: 30%;
  display: flex;
  justify-content: flex-start;
  height: 95vh;
  overflow-y: scroll;
`;

const StyledTrailListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
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

const PillContainer = styled.div`
  margin: 5px 5px 5px 0;
`

const LocationPill = styled.span`
  border: 1px solid blue;
  border-radius: 5px;
  font-size: 70%;
  padding: 4px;
  margin: 4px 4px 4px 0;
  background-color: white;
`

const DifficultyPill = styled(LocationPill)`
  border: 1px solid green;
`

const getTrails = () => {
  return fetch("data/trails/all-trails.json").then((res) => res.json());
};

interface Props {
  trailHandler: (trail: Trail) => void;
}

interface Trail {
  name: string;
  filename: string;
  province: string;
  difficulty: string;
}

export default function Sidebar({ trailHandler }: Props) {
  const [trails, setTrails] = useState<[]>([]);
  const [filteredTrails, setFilteredTrails] = useState<Trail[]>([]);
  const [filterTerm, setFilterTerm] = useState<string>("");

  useEffect(() => {
    getTrails().then(({ trails }) => {
      setFilteredTrails(trails);
      setTrails(trails);
    });
  }, []);

  useEffect(() => {
    if (!filterTerm) {
      setFilteredTrails(trails);
    }
    const trailsCopy: Trail[] = [...trails].filter((trail: Trail) => {
      return (
        trail.name.toLowerCase().includes(filterTerm) ||
        trail.province.toLowerCase().includes(filterTerm) ||
        trail.difficulty.toLowerCase().includes(filterTerm)
      );
    })
    setFilteredTrails(trailsCopy);
  }, [filterTerm])

  return (
    <StyledSidebar>
      <StyledTrailListContainer>
        <h1>AllMaps</h1>
        <h2>Saved Trails</h2>
        <FilterBar filterTerm={filterTerm} setFilterTerm={setFilterTerm}/>
        {filteredTrails.map((trail: Trail) => {
          return (
            <StyledTrailSelector
              key={trail.name}
              onClick={() => trailHandler(trail)}
            >
              {trail.name}
              <PillContainer>
                <LocationPill>{trail.province}</LocationPill>
                <DifficultyPill>{trail.difficulty}</DifficultyPill>
              </PillContainer>
            </StyledTrailSelector>
          );
        })}
      </StyledTrailListContainer>
    </StyledSidebar>
  );
}

Sidebar.propTypes = {
  trailHandler: PropTypes.func,
};

