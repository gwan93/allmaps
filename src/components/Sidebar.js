import { useEffect } from 'react';
import styled from 'styled-components'

const StyledSidebar = styled.div`
  border: 2px solid blue;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const getAllFileNames = () => {
  return fetch('data/trails/all-trails.json');
};


export default function Sidebar() {
  useEffect(() => {
    getAllFileNames()
    .then(response => response.json())
    .then(response => {
      for (const trail of response.trails) {
        console.log(trail.name)
      }
    })
  }, []);

  return (
    <StyledSidebar>
      This is the Sidebar
    </StyledSidebar>
  )
}