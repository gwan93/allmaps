import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from 'prop-types';

const StyledSidebar = styled.div`
  border: 2px solid blue;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledTrailListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTrailSelector = styled.div`
  border: 2px solid lightgrey;
  padding: 10px;
  margin: 2px;
  border-radius: 5px;
`;

const getTrails = () => {
  return fetch("data/trails/all-trails.json").then((res) => res.json());
};

interface Props {
  trailHandler: (trail: Trail) => void;
}

interface Trail {
  name: string;
  filename: string;
}

export default function Sidebar({ trailHandler }: Props) {
  const [trails, setTrails] = useState<[]>([]);

  useEffect(() => {
    getTrails().then(({ trails }) => {
      setTrails(trails);
    });
  }, []);

  return (
    <StyledSidebar>
      <StyledTrailListContainer>
        {trails.map((trail: Trail) => {
          return (
            <StyledTrailSelector key={trail.name} onClick={() => trailHandler(trail)}>
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
};