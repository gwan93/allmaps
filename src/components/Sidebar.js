import { useEffect } from 'react';
import styled from 'styled-components'

const StyledSidebar = styled.div`
  border: 2px solid blue;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const getTrails = async () => {
  return fetch('data/trails/all-trails.json')
  .then(res => res.json())
};


export default function Sidebar() {
  useEffect(() => {
    getTrails()
    .then(data => {
      data.trails.forEach(trail => {
        console.log(trail.name)
      })
    })
  }, []);

  return (
    <StyledSidebar>
      This is the Sidebar
    </StyledSidebar>
  )
}