import { useEffect, useState } from "react";
import styled from "styled-components";

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

const getTrails = async () => {
  return fetch("data/trails/all-trails.json").then((res) => res.json());
};

export default function Sidebar() {
  const [trailNames, setTrailNames] = useState([]);

  useEffect(() => {
    getTrails().then((data) => {
      const namesArr = [];
      data.trails.forEach((trail) => namesArr.push(trail.name));
      setTrailNames(namesArr);
    });
  }, []);

  return (
    <StyledSidebar>
      <StyledTrailListContainer>
        {trailNames.map((trailName) => {
          return (
            <StyledTrailSelector key={trailName}>
              {trailName}
            </StyledTrailSelector>
          );
        })}
      </StyledTrailListContainer>
    </StyledSidebar>
  );
}
