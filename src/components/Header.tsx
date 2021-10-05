import React from "react";
import styled from "styled-components";

const StyledHeader = styled.header`
  border: 2px solid lightgrey;
  border-radius: 5px;
  padding: 2em;
  margin: 1em 1.5em 0 1.5em;
  display: flex;
  justify-content: center;
`;

export default function Header() {
  return <StyledHeader>All Trails App Clone</StyledHeader>;
}
