import styled from 'styled-components'

const StyledSidebar = styled.div`
  border: 2px solid blue;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function Sidebar() {
  return (
    <StyledSidebar>
      This is the Sidebar
    </StyledSidebar>
  )
}