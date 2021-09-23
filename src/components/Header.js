import React from 'react';
import styled from 'styled-components'

const StyledHeader = styled.header`
  padding: 2em;
  border: 2px solid red;
  display: flex;
  justify-content: center;
`


export default function Header() {
  return (
    <StyledHeader>
      This is the Navbar
    </StyledHeader>
  )
}
