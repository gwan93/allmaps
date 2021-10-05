import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Input = styled.input`
  box-sizing: border-box;
  border: 2px solid lightgrey;
  padding: 10px;
  margin: 0 0 15px 0;
  border-radius: 5px;
  width: 100%;
  &:focus {
    outline: none;
    border: 2px solid black;
  }
`;

interface Props {
  filterTerm: string;
  setFilterTerm: (searchTerm: string) => void;
}

export default function FilterBar({ filterTerm, setFilterTerm }: Props) {
  return (
    <Input
      value={filterTerm}
      placeholder="Filter eg. 'Alberta', 'Easy'"
      onChange={(e) => setFilterTerm(e.target.value.toLowerCase())}
    />
  );
}

FilterBar.propTypes = {
  filterTerm: PropTypes.string,
  setFilterTerm: PropTypes.func,
};
